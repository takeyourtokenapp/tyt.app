// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./FeeConfig.sol";
import "./MinerNFT.sol";

/**
 * @title MinerMarketplace
 * @notice TYT v3 Miner NFT Marketplace - List and buy MinerNFTs with fee distribution
 * @dev Uses FeeConfig for configurable fee profiles. Fees are split to protocol/charity/academy.
 */
contract MinerMarketplace is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    Counters.Counter private _orderIdCounter;

    FeeConfig public feeConfig;
    MinerNFT public minerNFT;
    bytes32 public feeProfileKey;

    enum OrderStatus { Active, Filled, Cancelled }

    struct Order {
        uint256 orderId;
        uint256 tokenId;
        address seller;
        address paymentToken;
        uint256 price;
        OrderStatus status;
        uint256 createdAt;
        uint256 filledAt;
        address buyer;
    }

    mapping(uint256 => Order) public orders;
    mapping(uint256 => uint256) public tokenIdToOrderId;
    uint256[] private _activeOrderIds;

    bool public isPaused;

    event OrderCreated(
        uint256 indexed orderId,
        uint256 indexed tokenId,
        address indexed seller,
        address paymentToken,
        uint256 price
    );

    event OrderFilled(
        uint256 indexed orderId,
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price,
        uint256 feeTotal,
        uint256[] feeAmounts
    );

    event OrderCancelled(
        uint256 indexed orderId,
        uint256 indexed tokenId,
        address indexed seller
    );

    event FeeConfigUpdated(address newFeeConfig);
    event FeeProfileKeyUpdated(bytes32 newKey);
    event MarketplacePaused(bool isPaused);

    error OrderNotFound(uint256 orderId);
    error OrderNotActive(uint256 orderId);
    error NotSeller(uint256 orderId, address caller);
    error TokenAlreadyListed(uint256 tokenId);
    error NotTokenOwner(uint256 tokenId, address caller);
    error InsufficientPayment(uint256 required, uint256 provided);
    error MarketplacePausedError();
    error InvalidPrice();
    error CannotBuyOwnToken();
    error TransferFailed();

    constructor(
        address _feeConfig,
        address _minerNFT,
        bytes32 _feeProfileKey,
        address admin
    ) {
        feeConfig = FeeConfig(_feeConfig);
        minerNFT = MinerNFT(_minerNFT);
        feeProfileKey = _feeProfileKey;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
    }

    modifier whenNotPaused() {
        if (isPaused) revert MarketplacePausedError();
        _;
    }

    function createOrder(
        uint256 tokenId,
        address paymentToken,
        uint256 price
    ) external whenNotPaused nonReentrant returns (uint256) {
        if (price == 0) revert InvalidPrice();
        if (minerNFT.ownerOf(tokenId) != msg.sender) {
            revert NotTokenOwner(tokenId, msg.sender);
        }
        if (tokenIdToOrderId[tokenId] != 0 && orders[tokenIdToOrderId[tokenId]].status == OrderStatus.Active) {
            revert TokenAlreadyListed(tokenId);
        }

        minerNFT.transferFrom(msg.sender, address(this), tokenId);

        uint256 orderId = _orderIdCounter.current();
        _orderIdCounter.increment();

        orders[orderId] = Order({
            orderId: orderId,
            tokenId: tokenId,
            seller: msg.sender,
            paymentToken: paymentToken,
            price: price,
            status: OrderStatus.Active,
            createdAt: block.timestamp,
            filledAt: 0,
            buyer: address(0)
        });

        tokenIdToOrderId[tokenId] = orderId;
        _activeOrderIds.push(orderId);

        emit OrderCreated(orderId, tokenId, msg.sender, paymentToken, price);

        return orderId;
    }

    function fillOrder(uint256 orderId) external whenNotPaused nonReentrant {
        Order storage order = orders[orderId];

        if (order.createdAt == 0) revert OrderNotFound(orderId);
        if (order.status != OrderStatus.Active) revert OrderNotActive(orderId);
        if (order.seller == msg.sender) revert CannotBuyOwnToken();

        (
            uint256 feeTotal,
            address[] memory recipients,
            uint256[] memory feeAmounts
        ) = feeConfig.calculateFee(feeProfileKey, order.price);

        uint256 sellerReceives = order.price - feeTotal;

        if (order.paymentToken == address(0)) {
            if (msg.sender.balance < order.price) {
                revert InsufficientPayment(order.price, msg.sender.balance);
            }
        } else {
            IERC20 token = IERC20(order.paymentToken);
            token.safeTransferFrom(msg.sender, address(this), order.price);

            token.safeTransfer(order.seller, sellerReceives);

            for (uint256 i = 0; i < recipients.length; i++) {
                if (feeAmounts[i] > 0) {
                    token.safeTransfer(recipients[i], feeAmounts[i]);
                }
            }
        }

        minerNFT.transferFrom(address(this), msg.sender, order.tokenId);

        order.status = OrderStatus.Filled;
        order.filledAt = block.timestamp;
        order.buyer = msg.sender;

        _removeFromActiveOrders(orderId);

        emit OrderFilled(orderId, order.tokenId, msg.sender, order.price, feeTotal, feeAmounts);
    }

    function cancelOrder(uint256 orderId) external nonReentrant {
        Order storage order = orders[orderId];

        if (order.createdAt == 0) revert OrderNotFound(orderId);
        if (order.status != OrderStatus.Active) revert OrderNotActive(orderId);
        if (order.seller != msg.sender && !hasRole(OPERATOR_ROLE, msg.sender)) {
            revert NotSeller(orderId, msg.sender);
        }

        minerNFT.transferFrom(address(this), order.seller, order.tokenId);

        order.status = OrderStatus.Cancelled;

        _removeFromActiveOrders(orderId);

        emit OrderCancelled(orderId, order.tokenId, order.seller);
    }

    function _removeFromActiveOrders(uint256 orderId) internal {
        for (uint256 i = 0; i < _activeOrderIds.length; i++) {
            if (_activeOrderIds[i] == orderId) {
                _activeOrderIds[i] = _activeOrderIds[_activeOrderIds.length - 1];
                _activeOrderIds.pop();
                break;
            }
        }
    }

    function getOrder(uint256 orderId) external view returns (
        uint256 tokenId,
        address seller,
        address paymentToken,
        uint256 price,
        OrderStatus status,
        uint256 createdAt,
        uint256 filledAt,
        address buyer
    ) {
        Order storage order = orders[orderId];
        if (order.createdAt == 0) revert OrderNotFound(orderId);

        return (
            order.tokenId,
            order.seller,
            order.paymentToken,
            order.price,
            order.status,
            order.createdAt,
            order.filledAt,
            order.buyer
        );
    }

    function getActiveOrders() external view returns (uint256[] memory) {
        return _activeOrderIds;
    }

    function getActiveOrdersCount() external view returns (uint256) {
        return _activeOrderIds.length;
    }

    function getOrdersRange(uint256 start, uint256 count) external view returns (Order[] memory) {
        if (start >= _activeOrderIds.length) {
            return new Order[](0);
        }

        uint256 end = start + count;
        if (end > _activeOrderIds.length) {
            end = _activeOrderIds.length;
        }

        Order[] memory result = new Order[](end - start);
        for (uint256 i = start; i < end; i++) {
            result[i - start] = orders[_activeOrderIds[i]];
        }

        return result;
    }

    function calculateFeeForPrice(uint256 price) external view returns (
        uint256 feeTotal,
        address[] memory recipients,
        uint256[] memory feeAmounts
    ) {
        return feeConfig.calculateFee(feeProfileKey, price);
    }

    function setFeeConfig(address _feeConfig) external onlyRole(DEFAULT_ADMIN_ROLE) {
        feeConfig = FeeConfig(_feeConfig);
        emit FeeConfigUpdated(_feeConfig);
    }

    function setFeeProfileKey(bytes32 _feeProfileKey) external onlyRole(DEFAULT_ADMIN_ROLE) {
        feeProfileKey = _feeProfileKey;
        emit FeeProfileKeyUpdated(_feeProfileKey);
    }

    function setPaused(bool _isPaused) external onlyRole(OPERATOR_ROLE) {
        isPaused = _isPaused;
        emit MarketplacePaused(_isPaused);
    }

    function totalOrders() external view returns (uint256) {
        return _orderIdCounter.current();
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
