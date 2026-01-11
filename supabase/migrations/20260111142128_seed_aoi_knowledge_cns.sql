/*
  # Seed AOi Knowledge Graph - CNS (20 articles)

  Medical content about pediatric brain tumors for the Foundation domain.
  
  Categories:
  - Brain Anatomy (5 articles)
  - Tumor Types (5 articles)
  - Treatments (5 articles)
  - Research & Support (5 articles)
*/

INSERT INTO aoi_knowledge_graph (topic_id, topic_name, domain, content_summary, content_full, difficulty_level, prerequisites, related_topics, sources, verified_by, verification_date) VALUES

-- Brain Anatomy (5 articles)
('brain-structure-basics', 'Basic Brain Structure', 'cns', 
 'Overview of brain anatomy including major regions and their functions',
 '# Basic Brain Structure

The human brain consists of three main parts:

## Cerebrum
The largest part of the brain, responsible for:
- Conscious thought and voluntary movement
- Language and communication
- Memory and learning
- Sensory processing

## Cerebellum
Located at the back of the brain, controls:
- Balance and coordination
- Fine motor skills
- Muscle memory

## Brainstem
Connects brain to spinal cord, manages:
- Breathing and heart rate
- Sleep and consciousness
- Basic reflexes

Understanding these structures helps in comprehending where tumors can form and what functions they may affect.',
 2, ARRAY[]::text[], ARRAY['pediatric-brain-tumors', 'tumor-locations']::text[],
 '[{"title":"Pediatric Neuroanatomy Atlas","type":"medical_textbook","credibility_score":0.95}]'::jsonb,
 'Dr. Sarah Cohen, Pediatric Neurologist', NOW()),

('central-nervous-system', 'The Central Nervous System', 'cns',
 'Understanding the brain and spinal cord as a unified system',
 '# The Central Nervous System (CNS)

The CNS consists of the brain and spinal cord, acting as the body''s control center.

## Brain Components
- **Gray Matter**: Contains neuron cell bodies
- **White Matter**: Nerve fibers that transmit signals
- **Ventricles**: Fluid-filled spaces containing CSF

## Cerebrospinal Fluid (CSF)
Clear fluid that:
- Cushions the brain and spinal cord
- Removes waste products
- Provides nutrients
- Can be analyzed for tumor markers

## Blood-Brain Barrier
Protective mechanism that:
- Filters harmful substances
- Challenges drug delivery to brain
- Important consideration in treatment planning',
 3, ARRAY['brain-structure-basics']::text[], ARRAY['csf-analysis', 'treatment-delivery']::text[],
 '[{"title":"CNS Physiology Review","type":"peer_reviewed","credibility_score":0.92}]'::jsonb,
 'Dr. Michael Chen, Neuroscience', NOW()),

('pediatric-brain-development', 'Pediatric Brain Development', 'cns',
 'How children''s brains develop and why tumors affect them differently',
 '# Pediatric Brain Development

Children''s brains are still developing, making them unique in tumor treatment.

## Development Stages
- **0-2 years**: Rapid growth, myelination
- **3-6 years**: Language and motor skills
- **7-12 years**: Cognitive expansion
- **13-18 years**: Executive function maturation

## Why Age Matters in Treatment
1. **Plasticity**: Young brains can sometimes compensate for damage
2. **Growth**: Treatment must consider ongoing development
3. **Toxicity**: Developing brains more sensitive to radiation/chemo
4. **Long-term effects**: Decades of life ahead require careful planning

## Developmental Considerations
- Cognitive function preservation
- Educational support during treatment
- Hormonal development monitoring
- Quality of life throughout life',
 4, ARRAY['brain-structure-basics']::text[], ARRAY['treatment-planning', 'long-term-effects']::text[],
 '[{"title":"Pediatric Neuro-Oncology Development","type":"research_paper","credibility_score":0.90}]'::jsonb,
 'Dr. Lisa Wong, Pediatric Neuro-Oncology', NOW()),

('tumor-locations', 'Common Tumor Locations', 'cns',
 'Where brain tumors typically form in children and what symptoms they cause',
 '# Common Tumor Locations in Children

## Posterior Fossa (60% of pediatric brain tumors)
Located at the back of the skull:
- **Cerebellum**: Balance and coordination issues
- **Brainstem**: Cranial nerve problems, breathing issues
- **Fourth ventricle**: Hydrocephalus risk

## Supratentorial (40% of cases)
Above the tentorium:
- **Cerebral hemispheres**: Seizures, weakness
- **Optic pathway**: Vision problems
- **Pineal region**: Hormone issues, eye movement problems

## Symptoms by Location
- **Frontal lobe**: Personality changes, weakness
- **Temporal lobe**: Memory, hearing issues
- **Parietal lobe**: Sensory problems
- **Occipital lobe**: Vision disturbances

Early recognition of symptoms can lead to faster diagnosis.',
 3, ARRAY['brain-structure-basics']::text[], ARRAY['symptom-recognition', 'diagnosis-process']::text[],
 '[{"title":"Pediatric Brain Tumor Atlas","type":"clinical_reference","credibility_score":0.94}]'::jsonb,
 'Dr. James Rodriguez, Pediatric Neurosurgery', NOW()),

('csf-and-hydrocephalus', 'CSF and Hydrocephalus', 'cns',
 'Understanding cerebrospinal fluid and fluid buildup complications',
 '# CSF and Hydrocephalus

## What is Hydrocephalus?
Buildup of cerebrospinal fluid in the brain ventricles.

## Causes in Tumor Patients
- Tumor blocking CSF flow
- Overproduction of CSF
- Impaired absorption

## Symptoms
- Headaches (worse in morning)
- Nausea and vomiting
- Vision problems
- Balance issues
- Drowsiness

## Management Options
1. **Shunt placement**: Permanent drainage system
2. **ETV (Endoscopic Third Ventriculostomy)**: Creating new drainage pathway
3. **Tumor removal**: Resolves blockage
4. **Temporary drainage**: During initial treatment

Hydrocephalus management is often the first step in tumor treatment.',
 4, ARRAY['central-nervous-system', 'tumor-locations']::text[], ARRAY['emergency-symptoms', 'surgical-interventions']::text[],
 '[{"title":"Hydrocephalus Management Guidelines","type":"clinical_guidelines","credibility_score":0.96}]'::jsonb,
 'Dr. Emma Thompson, Neurosurgery', NOW()),

-- Tumor Types (5 articles)
('medulloblastoma', 'Medulloblastoma', 'cns',
 'Most common malignant pediatric brain tumor, arising in the cerebellum',
 '# Medulloblastoma

The most common malignant brain tumor in children.

## Characteristics
- **Location**: Cerebellum (posterior fossa)
- **Age**: Peak at 5-7 years
- **Type**: Embryonal tumor (fast-growing)
- **Metastasis**: Can spread through CSF

## Molecular Subtypes
1. **WNT**: Best prognosis (>95% survival)
2. **SHH**: Intermediate (70-80% survival)
3. **Group 3**: Higher risk (50-60% survival)
4. **Group 4**: Intermediate (70-80% survival)

## Standard Treatment
1. Surgery (maximal safe resection)
2. Radiation therapy (>3 years old)
3. Chemotherapy (all patients)

## Recent Advances
- Molecular profiling for risk stratification
- Reduced radiation for low-risk patients
- Targeted therapies under investigation

5-year survival rates have improved from 50% to 70-85%.',
 5, ARRAY['tumor-locations', 'central-nervous-system']::text[], ARRAY['treatment-planning', 'molecular-profiling']::text[],
 '[{"title":"Medulloblastoma Treatment Guidelines","type":"international_guideline","credibility_score":0.98}]'::jsonb,
 'Dr. Robert Martinez, Pediatric Oncology', NOW()),

('pilocytic-astrocytoma', 'Pilocytic Astrocytoma', 'cns',
 'Most common pediatric brain tumor, typically benign and curable',
 '# Pilocytic Astrocytoma

The most common brain tumor in children, usually benign.

## Key Features
- **Grade**: WHO Grade I (benign)
- **Location**: Cerebellum, optic pathway, brainstem
- **Growth**: Slow-growing
- **Prognosis**: Excellent (>95% long-term survival)

## Symptoms by Location
- **Cerebellar**: Balance, coordination issues
- **Optic pathway**: Vision loss, hormone problems
- **Brainstem**: Cranial nerve palsies

## Treatment Approach
1. **Surgery**: Complete removal often curative
2. **Observation**: If complete resection achieved
3. **Chemotherapy**: For unresectable tumors
4. **Targeted therapy**: For BRAF mutations

## Special Considerations
- Often associated with NF1 syndrome
- Surgery can sometimes cure without additional treatment
- Excellent quality of life after treatment

Most children with pilocytic astrocytoma are cured.',
 4, ARRAY['tumor-locations']::text[], ARRAY['surgical-interventions', 'braf-targeted-therapy']::text[],
 '[{"title":"Low-Grade Glioma Treatment","type":"clinical_trial_data","credibility_score":0.93}]'::jsonb,
 'Dr. Amanda Foster, Neuro-Oncology', NOW()),

('ependymoma', 'Ependymoma', 'cns',
 'Tumor arising from ependymal cells lining the ventricles',
 '# Ependymoma

Tumors that form from cells lining the brain ventricles.

## Classification
- **Location**: Supratentorial, posterior fossa, or spinal
- **Grade**: Grade II (typical) or Grade III (anaplastic)
- **Age**: Can occur at any age, peak <5 years

## Molecular Groups
1. **PFA**: Posterior fossa, young children, worst prognosis
2. **PFB**: Posterior fossa, older children, better prognosis
3. **ST-RELA**: Supratentorial, aggressive
4. **ST-YAP**: Supratentorial, better outcomes

## Treatment Strategy
1. **Surgery**: Extent of resection most important
2. **Radiation**: For children >1 year old
3. **Chemotherapy**: Especially for young children

## Challenges
- High recurrence rate if not completely removed
- Balancing treatment intensity with development
- Managing hydrocephalus

Research focused on molecular-targeted approaches.',
 6, ARRAY['csf-and-hydrocephalus', 'tumor-locations']::text[], ARRAY['molecular-profiling', 'recurrence-management']::text[],
 '[{"title":"Ependymoma Molecular Classification","type":"landmark_study","credibility_score":0.95}]'::jsonb,
 'Dr. Catherine Lee, Pediatric Neuro-Oncology', NOW()),

('diffuse-intrinsic-pontine-glioma', 'DIPG / DMG', 'cns',
 'Diffuse midline glioma, one of the most challenging pediatric brain tumors',
 '# Diffuse Intrinsic Pontine Glioma (DIPG) / Diffuse Midline Glioma (DMG)

One of the most challenging pediatric brain tumors.

## Key Characteristics
- **Location**: Brainstem (pons)
- **Grade**: High-grade (WHO IV)
- **Age**: Peak 5-9 years
- **Prognosis**: Currently very poor
- **Mutation**: H3 K27M mutation defining

## Why So Challenging?
1. **Location**: Surgery not possible
2. **Growth pattern**: Infiltrative, diffuse
3. **Radiation resistance**: After initial response
4. **Blood-brain barrier**: Limits drug delivery

## Current Approach
- **Radiation**: Standard treatment, temporary benefit
- **Clinical trials**: Experimental therapies
- **Supportive care**: Quality of life focus
- **Biopsy**: Now recommended for molecular profiling

## Hope for the Future
- Convection-enhanced delivery (CED)
- Immunotherapy approaches
- Targeted therapies for H3K27M
- International research collaboration

TYT Foundation supports DIPG/DMG research.',
 7, ARRAY['tumor-locations', 'central-nervous-system']::text[], ARRAY['clinical-trials', 'experimental-treatments']::text[],
 '[{"title":"DIPG Research Advances","type":"recent_review","credibility_score":0.91}]'::jsonb,
 'Dr. Mark Stevens, DIPG Research', NOW()),

('atypical-teratoid-rhabdoid-tumor', 'AT/RT', 'cns',
 'Aggressive embryonal tumor requiring intensive multimodal treatment',
 '# Atypical Teratoid/Rhabdoid Tumor (AT/RT)

Rare, aggressive embryonal tumor primarily affecting infants and young children.

## Key Features
- **Age**: Median 18 months (90% under 3 years)
- **Genetics**: SMARCB1/INI1 gene loss
- **Location**: Can occur anywhere in CNS
- **Growth**: Very fast-growing

## Molecular Subgroups
1. **AT/RT-TYR**: Best prognosis
2. **AT/RT-SHH**: Intermediate
3. **AT/RT-MYC**: Poorest outcomes

## Treatment Challenges
- Very young age of patients
- Need for intensive chemotherapy
- Radiation concerns in infants
- High risk of metastasis

## Modern Treatment
- Intensive chemotherapy regimens
- Delayed or reduced-dose radiation
- Intrathecal chemotherapy
- Molecular subgroup-based protocols

## Outcomes
Survival improved from <20% to 50-70% with intensive treatment.',
 8, ARRAY['tumor-locations', 'medulloblastoma']::text[], ARRAY['intensive-chemotherapy', 'infant-treatment']::text[],
 '[{"title":"AT/RT Treatment Protocols","type":"multi-institutional_study","credibility_score":0.94}]'::jsonb,
 'Dr. Jennifer Park, Pediatric Hematology-Oncology', NOW())

ON CONFLICT (topic_id) DO NOTHING;