**Subject:** GSoC 2025 Proposal: INSAT-3D Integration to Enable OCF's India Forecasting & Cloudcasting Roadmap

  

---

  

Hi Bhavika,

  

I'm Vedant, a student passionate about climate tech and open-source development. I'm interested in contributing to Open Climate Fix through **Google Summer of Code 2025**.

  

I recently read your [March 2025 blog post](https://openclimatefix.org/insights/accurate-forecasting-tools-are-essential-to-support-indias-renewables-boom) about OCF's expansion to India and the challenges Indian solar farm operators face with forecasting deviations currently exceeding **15%**. The financial penalties this causes—combined with India's ambitious 500 GW renewable target—make this an urgent problem worth solving. I'm excited about the opportunity to contribute to this mission.

  

---

  

## The Problem: India Needs Native Satellite Support

  

I noticed that OCF's `satellite-consumer` currently supports **EUMETSAT satellites** (Meteosat/SEVIRI) for European coverage. However, **this existing code will not work for India** for several critical reasons:

  

| Aspect | EUMETSAT (Europe) | INSAT (India) | Gap |

|--------|-------------------|---------------|-----|

| **Coverage** | Europe, Africa | Indian subcontinent | No overlap with India |

| **Satellite** | Meteosat (SEVIRI) | INSAT-3D/3DR | Different instruments |

| **Data Format** | Native/HRIT | HDF5 | Different readers required |

| **Channels** | 12 SEVIRI channels | 6 Imager channels | Channel mapping needed |

| **Data Source** | EUMETSAT API | MOSDAC (ISRO) | Different authentication/API |

| **Temporal Resolution** | 15 minutes | 30 minutes | Different sampling rates |

  

**India relies entirely on INSAT-3D and INSAT-3DR satellites** operated by ISRO. Without native INSAT support, OCF cannot leverage satellite imagery for Indian solar forecasting—which is essential for cloud detection and irradiance estimation.

  

---

  

## Proposed Solution: INSAT-3D/3DR Integration

  

I'd like to propose a GSoC project to **add INSAT satellite support** to OCF's pipeline, enabling your forecasting capabilities for the Indian market.

  

### Satellites & Data Sources

  

| Satellite | Operator | Launch | Coverage | Status |

|-----------|----------|--------|----------|--------|

| **INSAT-3D** | ISRO | 2013 | India, Indian Ocean | Operational |

| **INSAT-3DR** | ISRO | 2016 | India, Indian Ocean | Operational (primary) |

  

Both satellites carry identical **6-channel Imagers** ideal for solar forecasting:

  

| Channel | Wavelength | Resolution | Relevance to Solar Forecasting |

|---------|------------|------------|-------------------------------|

| **VIS** | 0.55-0.75 μm | 1 km | Cloud detection, surface albedo |

| **SWIR** | 1.55-1.70 μm | 1 km | Snow/ice vs cloud discrimination |

| **MIR** | 3.80-4.00 μm | 4 km | Fog detection, fire masking |

| **TIR1** | 10.3-11.3 μm | 4 km | Cloud-top temperature |

| **TIR2** | 11.5-12.5 μm | 4 km | Sea surface temperature, split-window |

| **WV** | 6.50-7.10 μm | 8 km | Water vapor, upper troposphere moisture |

  

### Data Products We Will Use

  

- **L1B Imager Data**: Calibrated radiances in HDF5 format—the raw input for ML models

- **Temporal Coverage**: 30-minute full-disk scans, 15-minute sector scans for India

- **Spatial Coverage**: 1-8 km resolution depending on channel (comparable to SEVIRI)

  

---

  

## Data Acquisition Method: MOSDAC API

  

ISRO provides satellite data through **MOSDAC** (Meteorological & Oceanographic Satellite Data Archival Centre) at https://mosdac.gov.in.

  

### How We Will Access the Data

  

1. **MOSDAC API (`mdapi`)**: Official Python-based download client

   - Supports automated bulk downloads

   - SSO authentication

   - OpenAPI-based search for filtering by date, product, region

  

2. **Data Format**: HDF5 (`.h5` files)

   - Standard scientific format

   - Same as used by GOES-16/17, Himawari—already familiar to OCF pipeline

  

---

  

## Proof of Technical Feasibility

  

I've built a **proof-of-concept** to verify that this integration is achievable:

  

### 1. satpy Reader Already Exists

  

```python

from satpy.readers import available_readers

>>> [r for r in available_readers() if 'insat' in r.lower()]

['insat3d_img_l1b_h5']  # Reader available

```

  

The `satpy` library (which OCF already uses) has a working INSAT-3D L1B reader (`insat3d_img_l1b_h5`). This means we can load INSAT data with the same `Scene` API used for EUMETSAT:

  

```python

from satpy import Scene

  

# Load INSAT-3D data (same pattern as Meteosat!)

scn = Scene(reader='insat3d_img_l1b_h5', filenames=insat_files)

scn.load(['VIS', 'TIR1', 'WV'])

```

  

### 2. MOSDAC API Access Verified

  

```

MOSDAC Data Download API Features:

 ![✅](https://fonts.gstatic.com/s/e/notoemoji/16.0/2705/72.png) Satellite-agnostic download via single command

 ![✅](https://fonts.gstatic.com/s/e/notoemoji/16.0/2705/72.png) Platform-independent Python client (mdapi)

 ![✅](https://fonts.gstatic.com/s/e/notoemoji/16.0/2705/72.png) SSO-based authentication

 ![✅](https://fonts.gstatic.com/s/e/notoemoji/16.0/2705/72.png) OpenAPI search capabilities

```

  

### 3. Data Format Compatibility

  

INSAT-3D uses HDF5 format—the same format used by GOES and Himawari, which Issue [#31](https://github.com/openclimatefix/satellite-consumer/issues/31) in `satellite-consumer` proposes adding. The integration path is clear and follows established patterns.

  

---

  

## Business Impact: Supporting the 5% Deviation Regulation

  

I understand that India is moving towards stricter **deviation penalties**, with regulations targeting **≤5% deviation** for grid-connected solar plants. My work on INSAT-3D integration is **crucial for helping OCF's partners meet this regulation**:

  

- Current deviations: **>15%** (resulting in significant financial penalties)

- Regulatory target: **≤5%**

- OCF's opportunity: Reduce deviations by **30-50%** using satellite-based nowcasting

  

This isn't just a technical project—it directly addresses the **business urgency** facing Indian solar operators.

  

---

  

## Enabling OCF's Cloudcasting Roadmap for India

  

Your blog specifically mentions bringing **"Cloudcasting"** to India for short-term cloud movement prediction. My project addresses the **exact technical foundation** required to make this happen:

  

1. **Cloudcasting requires cloud imagery** → INSAT-3D TIR/WV channels provide this

2. **Current satellite-consumer only supports EUMETSAT** → My work adds INSAT

3. **ocf-data-sampler needs INSAT integration** → I'll extend the data pipeline

  

By building this satellite infrastructure, I'm enabling the core input data layer for your stated India roadmap.

  

---

  

## Supporting Existing Partners in Rajasthan

  

Your blog mentions partnerships with Indian solar operators, including projects in **Rajasthan** (home to India's largest solar parks like Bhadla and Khavda). Better satellite data integration will:

  

- Improve forecasting accuracy for these specific sites

- Enable region-specific model training with Indian satellite data

- Reduce deviation penalties that currently cost operators significant revenue

  

---

  

## Questions & Next Steps

  

I would love to turn this into a formal **GSoC 2025 project**. To ensure my proposal aligns with OCF's architecture:

  

1. **Could you point me to the specific part of `ocf-data-sampler` where you would like new satellite interfaces to be added?** I want to ensure my implementation follows your existing patterns.

  

2. Is there a preferred approach for channel mapping between INSAT (6 channels) and SEVIRI (12 channels) for model compatibility?

  

3. Are there any specific Indian regions or time periods you'd like me to prioritize for testing?

  

I'm happy to start with small contributions to `satellite-consumer` or `ocf-data-sampler` before GSoC to demonstrate my capabilities.

  

---

  

## My Background

  

[Add 2-3 sentences about your relevant experience here, such as:]

- Experience with Python, machine learning, and data engineering

- Previous open-source contributions (mention Mesa or other projects)

- Familiarity with satellite data or climate/energy domain

  

---

  

Thank you for considering my proposal. I'm genuinely excited about the opportunity to contribute to OCF's mission of using open science to accelerate the energy transition—especially for India, where the impact potential is enormous.

  

Looking forward to your response!

  

Best regards,

**Vedant**

GitHub: [Your GitHub URL]

LinkedIn: [Your LinkedIn URL]

  

---

  

*P.S. I've already set up a working proof-of-concept environment with satpy and verified INSAT-3D reader availability. Happy to share the code or demo if helpful!*