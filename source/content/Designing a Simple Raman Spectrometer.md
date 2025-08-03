## Overview

Raman spectroscopy is a powerful technique that detects molecular vibrations by measuring the inelastic scattering of monochromatic light, typically from a laser. I have chosen to focus on a Raman spectrometer, building upon the recognized advantages of Raman over techniques like fluorescence spectroscopy for specific molecular identification and its ability to function effectively even in the presence of water, a key consideration for Martian regolith and potential subsurface ice. For a Mars rover application, the spectrometer must be compact, lightweight, cost-effective, and robust to identify minerals and organic compounds on the Martian surface. This design outlines a basic Raman spectrometer that can be built with off-the-shelf components.

---
## Components
My Raman spectrometer design comprises five fundamental sections - the excitation source, sample illumination and collection optics, Rayleigh scattering rejection filter, dispersive element, and detector.

### Excitation Source: Compact Diode Laser

- **Choice:** A compact, low-power **785 nm diode laser**.
- **Justification:**
    - **Cost-Effectiveness:** Diode lasers are significantly more affordable than other laser technologies (e.g., solid-state or gas lasers).
    - **Compactness & Power Efficiency:** Their small form factor and low power consumption are crucial for integration onto a resource-constrained rover platform.
    - **Reduced Fluorescence (Primary Justification):** While 532 nm (green) lasers are common and inexpensive, they often induce higher levels of fluorescence in geological samples, which can obscure the weaker Raman signal. The **785 nm (near-infrared)** wavelength is specifically chosen to mitigate this issue, allowing for clearer and more distinct Raman spectra from complex Martian samples (e.g., minerals, organic compounds). This aligns with our previous argument for Raman's superiority by directly addressing a common challenge.
- **Implementation:** The laser will be mounted in a fixed position, ensuring the beam is stable and directed towards the sample
  
### Optical System

- **Focusing Lens**: Plano-convex lens (focal length ~25 mm, ~$20) to focus the laser onto the sample.    
- **Collection Optics**: Two achromatic lenses (~$30 each) to collect scattered light and collimate it into the spectrometer.
- **Notch Filter**: 532 nm Raman notch filter to block the Rayleigh scattered light (elastic scattering) and pass the Raman-shifted light.
- **Dichroic Mirror**: 532 nm edge filter to separate the laser excitation from the scattered light.
  
### Rayleigh Scattering Rejection Filter: Long-Pass Filter
  
  The intensity of the elastic (Rayleigh) scattered laser light is orders of magnitude greater than the inelastic (Raman) scattered light. Without effective rejection of the Rayleigh light, the faint Raman signal would be completely swamped. That is why, we need a long pass filter.
  
### Dispersive Element: Transmission Diffraction Grating

The grating's primary function is to separate the collected Raman scattered light into its constituent wavelengths. As light passes through the grating, different wavelengths are diffracted at different angles, creating a spectrum. Diffraction gratings are significantly more cost-effective and easier to integrate into a compact design compared to prisms or more complex holographic gratings. Transmission gratings allow light to pass directly through them, which can simplify the optical path.

### Detector: Linear CMOS or CCD Array

Linear array detectors are small and easily integrated into a compact design. Unlike a single photodiode that would require scanning, a linear array captures the entire dispersed spectrum simultaneously, providing rapid data acquisition. Each pixel on the array corresponds to a specific wavelength, allowing for the direct measurement of the intensity of the Raman scattered light across the spectral range. These sensors can typically be interfaced with common microcontrollers (e.g., Raspberry Pi, Arduino with appropriate drivers) for data readout and processing, demonstrating the "implementable" aspect of the design

### Mechanical Design, Electronics and Control

A custom-designed and 3D-printed enclosure for the entire spectrometer. The design will include integrated holders and alignment features for the laser, lenses, filter, grating, and detector, ensuring they are held in precise optical alignment. A simple sample stage will be incorporated for ease of use.

Arduino Uno or Raspberry Pi for controlling the laser and reading the CCD output.

