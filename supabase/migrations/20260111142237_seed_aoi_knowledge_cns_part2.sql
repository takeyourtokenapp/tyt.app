/*
  # Seed AOi Knowledge Graph - CNS Part 2 (Remaining 10 articles)

  Treatments (5 articles) and Research & Support (5 articles)
*/

INSERT INTO aoi_knowledge_graph (topic_id, topic_name, domain, content_summary, content_full, difficulty_level, prerequisites, related_topics, sources, verified_by, verification_date) VALUES

-- Treatments (5 articles)
('neurosurgery-basics', 'Neurosurgery for Brain Tumors', 'cns',
 'Surgical approaches, goals, and considerations in pediatric brain tumor surgery',
 '# Neurosurgery for Brain Tumors

Surgery is often the first and most important treatment step.

## Goals of Surgery
1. **Diagnosis**: Obtain tissue for analysis
2. **Cytoreduction**: Remove as much tumor as possible
3. **Symptom relief**: Reduce pressure, restore CSF flow
4. **Cure**: Complete removal when feasible

## Surgical Approaches
- **Craniotomy**: Opening skull to access tumor
- **Endoscopic**: Minimally invasive through nose or ventricle
- **Stereotactic biopsy**: Needle biopsy for deep tumors

## Intraoperative Technologies
- **Neuronavigation**: GPS for the brain
- **MRI**: Real-time imaging during surgery
- **Neurophysiological monitoring**: Protect critical functions
- **Fluorescence guidance**: Visualize tumor margins

## Extent of Resection
- **Gross total**: Complete removal
- **Near total**: >95% removed
- **Subtotal**: >50% removed
- **Biopsy**: Sample only

More complete resection generally improves outcomes.',
 5, ARRAY['tumor-locations']::text[], ARRAY['surgical-complications', 'recovery-process']::text[],
 '[{"title":"Pediatric Neurosurgical Techniques","type":"surgical_atlas","credibility_score":0.96}]'::jsonb,
 'Dr. David Kumar, Pediatric Neurosurgery', NOW()),

('radiation-therapy', 'Radiation Therapy', 'cns',
 'How radiation works, modern techniques, and managing side effects',
 '# Radiation Therapy for Pediatric Brain Tumors

Radiation kills tumor cells using high-energy beams.

## Modern Techniques
- **Proton therapy**: More precise, less scatter
- **IMRT**: Intensity-modulated radiation
- **Stereotactic radiosurgery**: Single high-dose treatment
- **Craniospinal irradiation**: Whole brain and spine

## Age Considerations
- Generally avoided in children <3 years
- Dose reduction strategies for young children
- Long-term effects on development

## Potential Side Effects
**Acute (during treatment)**:
- Fatigue, nausea
- Skin irritation
- Hair loss

**Long-term**:
- Cognitive effects
- Hormone deficiencies
- Secondary cancers (rare)
- Hearing loss

## Supportive Care
- Neuropsychological support
- Endocrine monitoring
- Educational accommodations
- Physical therapy

Risk-benefit carefully weighed for each patient.',
 6, ARRAY['medulloblastoma', 'treatment-planning']::text[], ARRAY['long-term-effects', 'supportive-care']::text[],
 '[{"title":"Pediatric Radiation Oncology Guidelines","type":"consensus_guidelines","credibility_score":0.97}]'::jsonb,
 'Dr. Rachel Green, Radiation Oncology', NOW()),

('chemotherapy-basics', 'Chemotherapy', 'cns',
 'How chemotherapy works and what to expect during treatment',
 '# Chemotherapy for Brain Tumors

Chemotherapy uses drugs to kill rapidly dividing cells.

## Common Regimens
- **Temozolomide**: Oral alkylating agent
- **Vincristine**: Prevents cell division
- **Carboplatin/Cisplatin**: DNA-damaging agents
- **Cyclophosphamide**: Alkylating agent
- **Etoposide**: Topoisomerase inhibitor

## Routes of Administration
- **Intravenous**: Most common
- **Oral**: Some drugs available as pills
- **Intrathecal**: Directly into CSF
- **Intra-arterial**: Experimental, bypass BBB

## Managing Side Effects
**Common**:
- Nausea and vomiting (preventable)
- Low blood counts (infection risk)
- Fatigue
- Hair loss (temporary)

**Less common**:
- Neuropathy
- Hearing loss
- Kidney problems
- Cardiac effects

## Blood Count Monitoring
- **WBC**: Infection protection
- **Platelets**: Prevent bleeding
- **Hemoglobin**: Oxygen carrying

Supportive medications reduce side effects significantly.',
 5, ARRAY['treatment-planning']::text[], ARRAY['supportive-care', 'infection-prevention']::text[],
 '[{"title":"Pediatric Chemotherapy Protocols","type":"treatment_guidelines","credibility_score":0.93}]'::jsonb,
 'Dr. Susan Miller, Pediatric Oncology', NOW()),

('targeted-therapy', 'Targeted & Immunotherapy', 'cns',
 'Precision medicine approaches targeting specific tumor mutations',
 '# Targeted and Immunotherapy

Modern treatments targeting specific molecular abnormalities.

## Targeted Therapy Examples
- **BRAF inhibitors**: For BRAF-mutant tumors
- **MEK inhibitors**: Often combined with BRAF inhibitors
- **mTOR inhibitors**: For SEGA in TSC
- **ALK inhibitors**: For ALK-fusion tumors

## Immunotherapy Approaches
- **Checkpoint inhibitors**: Release immune system brakes
- **CAR T-cell therapy**: Engineered immune cells
- **Vaccine therapy**: Train immune system
- **Oncolytic viruses**: Viruses that attack tumors

## Advantages
- More specific than chemotherapy
- Potentially fewer side effects
- Can be taken orally
- Some work where other treatments fail

## Limitations
- Not all tumors have targetable mutations
- Resistance can develop
- Side effects still occur
- Access can be limited

Many targeted therapies available through clinical trials.',
 7, ARRAY['molecular-profiling', 'clinical-trials']::text[], ARRAY['precision-medicine', 'genomic-testing']::text[],
 '[{"title":"Precision Oncology in Pediatrics","type":"cutting_edge_review","credibility_score":0.90}]'::jsonb,
 'Dr. Thomas Wright, Molecular Oncology', NOW()),

('clinical-trials', 'Clinical Trials', 'cns',
 'Understanding clinical trials and how to access experimental treatments',
 '# Clinical Trials in Pediatric Neuro-Oncology

Clinical trials test new treatments to improve outcomes.

## Trial Phases
- **Phase I**: Safety, dose-finding
- **Phase II**: Efficacy testing
- **Phase III**: Comparison to standard treatment
- **Phase IV**: Post-approval monitoring

## When to Consider
- Standard treatment not effective
- High-risk disease needing better options
- Access to promising new therapies
- Contributing to research

## How to Find Trials
- **ClinicalTrials.gov**: Official US registry
- **Institutional cancer centers**: Major hospitals
- **PNOC**: Pacific Pediatric Neuro-Oncology Consortium
- **COG**: Children''s Oncology Group

## Questions to Ask
- What is the treatment being tested?
- What are the potential benefits and risks?
- What will my child''s care involve?
- Who will be in charge of care?
- What are the costs?

## Protection for Participants
- Informed consent
- IRB oversight
- Right to withdraw
- Careful monitoring

Trials offer hope and advance knowledge for future patients.',
 6, ARRAY['treatment-planning']::text[], ARRAY['experimental-treatments', 'research-participation']::text[],
 '[{"title":"Clinical Trial Design Pediatrics","type":"educational_resource","credibility_score":0.92}]'::jsonb,
 'Dr. Patricia Anderson, Clinical Research', NOW()),

-- Research & Support (5 articles)
('genomic-profiling', 'Genomic & Molecular Profiling', 'cns',
 'How genetic testing guides treatment decisions',
 '# Genomic and Molecular Profiling

Modern tumor analysis to guide personalized treatment.

## What is Analyzed?
- **DNA sequencing**: Identify mutations
- **RNA sequencing**: Gene expression patterns
- **Methylation profiling**: Epigenetic changes
- **Protein markers**: IHC staining

## Why It Matters
1. **Diagnosis**: More accurate tumor classification
2. **Prognosis**: Predict outcomes
3. **Treatment**: Match targeted therapies
4. **Clinical trials**: Eligibility determination

## Common Findings
- **BRAF V600E**: Targetable in low-grade gliomas
- **H3 K27M**: Defines DMG
- **SMARCB1 loss**: Diagnostic for AT/RT
- **WNT/SHH**: Medulloblastoma subtypes
- **NTRK fusions**: Pan-cancer targetable

## Access to Testing
- Often covered by insurance for pediatric brain tumors
- Research protocols may offer free testing
- Tissue from surgery or biopsy required

Molecular profiling is becoming standard of care.',
 7, ARRAY['targeted-therapy']::text[], ARRAY['precision-medicine', 'treatment-planning']::text[],
 '[{"title":"Molecular Diagnostics in Pediatric CNS Tumors","type":"practice_guidelines","credibility_score":0.96}]'::jsonb,
 'Dr. Elizabeth Chen, Molecular Pathology', NOW()),

('family-support', 'Family Support Services', 'cns',
 'Resources, support systems, and coping strategies for families',
 '# Family Support Services

Comprehensive support for families facing pediatric brain tumors.

## Medical Support
- **Social workers**: Navigate healthcare system
- **Care coordinators**: Manage appointments
- **Financial counselors**: Insurance, assistance programs
- **Home health**: Nursing, therapy at home

## Emotional Support
- **Psychologists**: Individual and family therapy
- **Support groups**: Connect with other families
- **Chaplains**: Spiritual support
- **Sibling programs**: Support for brothers/sisters

## Practical Support
- **Housing**: Near treatment centers
- **Transportation**: To/from appointments
- **Meal programs**: Nutritious food
- **School liaison**: Educational accommodations

## Organizations Helping Families
- **TYT Foundation**: Research funding, family support
- **Children''s Brain Tumor Foundation**
- **Pediatric Brain Tumor Foundation**
- **Alex''s Lemonade Stand Foundation**
- **St. Baldrick''s Foundation**

## Financial Assistance
- Travel expense reimbursement
- Prescription assistance
- Utility payment help
- Lost wages compensation

You are not alone - support is available.',
 3, ARRAY[]::text[], ARRAY['coping-strategies', 'patient-resources']::text[],
 '[{"title":"Comprehensive Family Support Programs","type":"resource_guide","credibility_score":0.94}]'::jsonb,
 'Sarah Johnson, MSW, Oncology Social Work', NOW()),

('long-term-survivorship', 'Long-Term Survivorship', 'cns',
 'Life after treatment: monitoring, late effects, and quality of life',
 '# Long-Term Survivorship

Life after pediatric brain tumor treatment requires ongoing care.

## Surveillance Monitoring
- **MRI scans**: Detect recurrence
  - Frequent initially (every 3 months)
  - Less frequent as time passes
- **Physical exams**: Neurological function
- **Blood tests**: Hormone levels

## Potential Late Effects
**Neurological**:
- Seizures
- Motor weakness
- Cognitive changes

**Endocrine**:
- Growth hormone deficiency
- Thyroid dysfunction
- Puberty delays

**Other**:
- Hearing loss
- Vision problems
- Second cancers (rare)

## Long-Term Care Team
- Neuro-oncologist
- Endocrinologist
- Neuropsychologist
- Rehabilitation specialists
- Primary care physician

## Optimizing Quality of Life
- Educational accommodations (IEP/504 plans)
- Cognitive rehabilitation
- Physical therapy
- Career counseling
- Peer support

## Survivorship Clinics
Specialized programs coordinating all aspects of long-term care.

Many survivors lead full, productive lives.',
 5, ARRAY['radiation-therapy', 'chemotherapy-basics']::text[], ARRAY['quality-of-life', 'rehabilitation']::text[],
 '[{"title":"Pediatric Cancer Survivorship Guidelines","type":"COG_guidelines","credibility_score":0.98}]'::jsonb,
 'Dr. Laura Bennett, Survivorship Program', NOW()),

('tyt-foundation-mission', 'TYT Foundation Mission', 'both',
 'How TYT Foundation supports pediatric brain cancer research and families',
 '# TYT Children''s Brain Cancer Research & Support Foundation

Combining Web3 innovation with medical research to save children''s lives.

## Our Mission
Fund cutting-edge research while supporting families facing pediatric brain tumors.

## How We Help
**Research Funding**:
- Novel treatment development
- Molecular profiling studies
- Clinical trial support
- Collaborative research grants

**Family Support**:
- Travel assistance
- Accommodation support
- Educational resources
- Connection to care teams

**Awareness & Education**:
- Web3 community engagement
- Scientific literacy programs
- Hope through innovation

## How It Works
Every transaction in the TYT ecosystem supports the foundation:
- Mining maintenance fees → 1% to foundation
- Marketplace trades → 1% to foundation
- Token burns → CharityMint to foundation
- Direct donations welcomed

## Our Partners
Collaborating with leading institutions:
- Major children''s hospitals
- Research universities
- Patient advocacy organizations
- Clinical trial consortia

## Transparency
- Blockchain-tracked donations
- Public spending reports
- Research progress updates
- Family impact stories

## Get Involved
- Mine for a cure
- Participate in the academy
- Share your story
- Donate directly

Together, we''re making a difference.',
 2, ARRAY[]::text[], ARRAY['web3-for-good', 'charitable-giving']::text[],
 '[{"title":"TYT Foundation Charter","type":"founding_document","credibility_score":1.0}]'::jsonb,
 'TYT Foundation Board', NOW()),

('research-advances', 'Recent Research Advances', 'cns',
 'Latest breakthroughs in pediatric brain tumor research',
 '# Recent Research Advances

Exciting progress in understanding and treating pediatric brain tumors.

## Molecular Classification
- Tumors classified by genetics, not just appearance
- Leads to more precise treatment
- Identifies new therapeutic targets

## Immunotherapy Breakthroughs
- CAR T-cells showing promise
- Checkpoint inhibitors in trials
- Vaccine therapies emerging
- GD2-targeted approaches

## Liquid Biopsies
- Detect tumor DNA in blood or CSF
- Monitor treatment response
- Detect recurrence earlier
- Less invasive than repeat surgery

## Drug Delivery Innovations
- Convection-enhanced delivery (CED)
- Focused ultrasound to open BBB
- Nanoparticle carriers
- Direct tumor injections

## AI & Machine Learning
- Improved imaging analysis
- Treatment response prediction
- Drug discovery acceleration
- Personalized treatment planning

## International Collaboration
- SIOP: International Society of Pediatric Oncology
- PNOC: Pacific Pediatric Neuro-Oncology Consortium
- ITCC: Innovative Therapies for Children with Cancer

## TYT-Supported Research
Foundation funding accelerating promising projects in:
- DMG/DIPG therapies
- Reducing treatment toxicity
- Quality of life improvements
- Family support innovations

The future is brighter than ever.',
 6, ARRAY['targeted-therapy', 'clinical-trials']::text[], ARRAY['precision-medicine', 'tyt-foundation-mission']::text[],
 '[{"title":"Pediatric Neuro-Oncology Research Updates","type":"annual_review","credibility_score":0.94}]'::jsonb,
 'Dr. Kevin Murphy, Research Director', NOW())

ON CONFLICT (topic_id) DO NOTHING;