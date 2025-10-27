# Resources

- https://www.projectrho.com/public_html/starmaps/catalogues.php
- https://astronexus.com/projects/hyg
- https://exoplanet.eu/catalog/#downloads-section

# HYG Database Star Entry Explanation

Here’s a field-by-field explanation of your HYG Database star entry, with short names, units, and meanings when known from the HYG catalog documentation and astronomical conventions.

---

### Star #89 (Tau Phoenicis — abbreviated “Tau Phe”)

| **Field**        | **Short Name**  | **Meaning**                                              | **Units**                     |
| ---------------- | --------------- | -------------------------------------------------------- | ----------------------------- |
| `"id"`           | ID              | Internal sequential star ID used in HYG                  | —                             |
| `"hip"`          | HIP             | Identifier from the Hipparcos Catalogue                  | —                             |
| `"hd"`           | HD              | Entry number in the Henry Draper Catalogue               | —                             |
| `"hr"`           | HR              | Harvard Revised (Bright Star Catalogue) number           | —                             |
| `"gl"`           | Gliese          | Identifier from the Gliese Catalogue                     | —                             |
| `"bf"`           | Bayer-Flamsteed | Standard Bayer or Flamsteed designation (e.g. “Tau Phe”) | —                             |
| `"proper"`       | Proper Name     | Common or traditional star name                          | —                             |
| `"ra"`           | RA_deg          | Right Ascension in **degrees** (J2000 epoch)             | degrees                       |
| `"dec"`          | Dec_deg         | Declination in **degrees** (J2000 epoch)                 | degrees                       |
| `"dist"`         | Distance_ly     | Distance in **light-years**                              | light-years                   |
| `"pmra"`         | PM_RA           | Proper motion in Right Ascension                         | milliarcseconds/year (mas/yr) |
| `"pmdec"`        | PM_Dec          | Proper motion in Declination                             | milliarcseconds/year (mas/yr) |
| `"rv"`           | RadialVel       | Radial velocity relative to Sun                          | km/s                          |
| `"mag"`          | AppMag          | Apparent magnitude (brightness from Earth)               | mag                           |
| `"absmag"`       | AbsMag          | Absolute magnitude (intrinsic brightness)                | mag                           |
| `"spect"`        | SpectType       | Spectral classification (temperature & luminosity class) | —                             |
| `"ci"`           | ColorIndex      | B–V color index (measure of color/temperature)           | mag                           |
| `"x"`            | X_pc            | Cartesian X coordinate (Galactic frame, Sun at origin)   | parsecs                       |
| `"y"`            | Y_pc            | Cartesian Y coordinate                                   | parsecs                       |
| `"z"`            | Z_pc            | Cartesian Z coordinate                                   | parsecs                       |
| `"vx"`           | Vel_X           | Velocity component in X direction                        | parsecs/year (approx)         |
| `"vy"`           | Vel_Y           | Velocity component in Y direction                        | parsecs/year (approx)         |
| `"vz"`           | Vel_Z           | Velocity component in Z direction                        | parsecs/year (approx)         |
| `"rarad"`        | RA_rad          | Right Ascension in **radians**                           | radians                       |
| `"decrad"`       | Dec_rad         | Declination in **radians**                               | radians                       |
| `"pmrarad"`      | PM_RA_rad       | Proper motion in RA converted to radians/year            | radians/year                  |
| `"pmdecrad"`     | PM_Dec_rad      | Proper motion in Dec converted to radians/year           | radians/year                  |
| `"bayer"`        | Bayer           | Bayer Greek letter designation                           | —                             |
| `"flam"`         | Flamsteed       | Flamsteed number if available                            | —                             |
| `"con"`          | Constellation   | IAU abbreviation for constellation (“Phe” = Phoenix)     | —                             |
| `"comp"`         | ComponentNo     | Component index (for multiple star system)               | —                             |
| `"comp_primary"` | CompPrimary     | ID number of the system’s primary component              | —                             |
| `"base"`         | SystemBase      | Common identifier for a binary/multiple system           | —                             |
| `"lum"`          | Luminosity      | Luminosity relative to the Sun                           | L☉                            |
| `"var"`          | VariableStar    | Variable star designation                                | —                             |
| `"var_min"`      | VarMin          | Minimum apparent magnitude observed                      | mag                           |
| `"var_max"`      | VarMax          | Maximum apparent magnitude observed                      | mag                           |

---

Would you like me to convert the Cartesian (x, y, z) values from parsecs to light-years or vice versa for easier interpretation?

# Exoplanet.eu Catalog Entry Explanation

The Exoplanet.eu catalog provides comprehensive data about confirmed exoplanets and their host stars. The catalog contains 98 fields covering planetary properties, orbital characteristics, detection methods, and stellar parameters.

---

## Planet Properties

| **Field**                  | **Short Name**        | **Meaning**                                           | **Units**      |
| -------------------------- | --------------------- | ----------------------------------------------------- | -------------- |
| `name`                     | Planet Name           | Official planet designation                           | —              |
| `planet_status`            | Status                | Confirmation status (e.g., "Confirmed")               | —              |
| `mass`                     | Mass                  | True planetary mass                                   | Jupiter masses |
| `mass_error_min`           | Mass Error -          | Lower uncertainty on mass                             | Jupiter masses |
| `mass_error_max`           | Mass Error +          | Upper uncertainty on mass                             | Jupiter masses |
| `mass_sini`                | Mass·sin(i)           | Minimum mass (for RV detections)                      | Jupiter masses |
| `mass_sini_error_min`      | Mass·sin(i) Error -   | Lower uncertainty on minimum mass                     | Jupiter masses |
| `mass_sini_error_max`      | Mass·sin(i) Error +   | Upper uncertainty on minimum mass                     | Jupiter masses |
| `radius`                   | Radius                | Planetary radius                                      | Jupiter radii  |
| `radius_error_min`         | Radius Error -        | Lower uncertainty on radius                           | Jupiter radii  |
| `radius_error_max`         | Radius Error +        | Upper uncertainty on radius                           | Jupiter radii  |

## Orbital Parameters

| **Field**                  | **Short Name**        | **Meaning**                                           | **Units**      |
| -------------------------- | --------------------- | ----------------------------------------------------- | -------------- |
| `orbital_period`           | Period                | Orbital period around host star                       | days           |
| `orbital_period_error_min` | Period Error -        | Lower uncertainty on period                           | days           |
| `orbital_period_error_max` | Period Error +        | Upper uncertainty on period                           | days           |
| `semi_major_axis`          | Semi-major Axis       | Average orbital distance from star                    | AU             |
| `semi_major_axis_error_min`| SMA Error -           | Lower uncertainty on semi-major axis                  | AU             |
| `semi_major_axis_error_max`| SMA Error +           | Upper uncertainty on semi-major axis                  | AU             |
| `eccentricity`             | Eccentricity          | Orbital shape (0=circular, >0=elliptical)             | —              |
| `eccentricity_error_min`   | Ecc Error -           | Lower uncertainty on eccentricity                     | —              |
| `eccentricity_error_max`   | Ecc Error +           | Upper uncertainty on eccentricity                     | —              |
| `inclination`              | Inclination           | Orbital tilt relative to line of sight                | degrees        |
| `inclination_error_min`    | Inc Error -           | Lower uncertainty on inclination                      | degrees        |
| `inclination_error_max`    | Inc Error +           | Upper uncertainty on inclination                      | degrees        |
| `angular_distance`         | Angular Distance      | Angular separation from star as seen from Earth       | arcseconds     |
| `omega`                    | ω (Omega)             | Argument of periastron                                | degrees        |
| `omega_error_min`          | ω Error -             | Lower uncertainty on omega                            | degrees        |
| `omega_error_max`          | ω Error +             | Upper uncertainty on omega                            | degrees        |

## Timing Parameters

| **Field**                  | **Short Name**        | **Meaning**                                           | **Units**      |
| -------------------------- | --------------------- | ----------------------------------------------------- | -------------- |
| `tperi`                    | T_peri                | Time of periastron passage (closest approach)         | JD             |
| `tperi_error_min`          | T_peri Error -        | Lower uncertainty on periastron time                  | JD             |
| `tperi_error_max`          | T_peri Error +        | Upper uncertainty on periastron time                  | JD             |
| `tconj`                    | T_conj                | Time of conjunction                                   | JD             |
| `tconj_error_min`          | T_conj Error -        | Lower uncertainty on conjunction time                 | JD             |
| `tconj_error_max`          | T_conj Error +        | Upper uncertainty on conjunction time                 | JD             |
| `tzero_tr`                 | T₀ Transit            | Time of primary transit (planet crosses star)         | JD             |
| `tzero_tr_error_min`       | T₀ Transit Error -    | Lower uncertainty on transit time                     | JD             |
| `tzero_tr_error_max`       | T₀ Transit Error +    | Upper uncertainty on transit time                     | JD             |
| `tzero_tr_sec`             | T₀ Secondary          | Time of secondary eclipse (star blocks planet)        | JD             |
| `tzero_tr_sec_error_min`   | T₀ Secondary Error -  | Lower uncertainty on secondary eclipse time           | JD             |
| `tzero_tr_sec_error_max`   | T₀ Secondary Error +  | Upper uncertainty on secondary eclipse time           | JD             |
| `tzero_vr`                 | T₀ Radial Velocity    | Reference time for radial velocity measurements       | JD             |
| `tzero_vr_error_min`       | T₀ RV Error -         | Lower uncertainty on RV reference time                | JD             |
| `tzero_vr_error_max`       | T₀ RV Error +         | Upper uncertainty on RV reference time                | JD             |

*JD = Julian Date (astronomical time standard)*

## Observational Data

| **Field**                  | **Short Name**        | **Meaning**                                           | **Units**      |
| -------------------------- | --------------------- | ----------------------------------------------------- | -------------- |
| `lambda_angle`             | λ (Lambda)            | Sky-projected spin-orbit angle                        | degrees        |
| `lambda_angle_error_min`   | λ Error -             | Lower uncertainty on lambda                           | degrees        |
| `lambda_angle_error_max`   | λ Error +             | Upper uncertainty on lambda                           | degrees        |
| `impact_parameter`         | Impact Parameter      | Projected distance during transit (0=center, 1=edge)  | —              |
| `impact_parameter_error_min`| b Error -            | Lower uncertainty on impact parameter                 | —              |
| `impact_parameter_error_max`| b Error +            | Upper uncertainty on impact parameter                 | —              |
| `k`                        | K (RV Amplitude)      | Radial velocity semi-amplitude                        | m/s            |
| `k_error_min`              | K Error -             | Lower uncertainty on RV amplitude                     | m/s            |
| `k_error_max`              | K Error +             | Upper uncertainty on RV amplitude                     | m/s            |

## Atmospheric & Physical Properties

| **Field**                  | **Short Name**        | **Meaning**                                           | **Units**      |
| -------------------------- | --------------------- | ----------------------------------------------------- | -------------- |
| `temp_calculated`          | Temp (Calculated)     | Equilibrium temperature (calculated)                  | K              |
| `temp_calculated_error_min`| Temp Calc Error -     | Lower uncertainty on calculated temperature           | K              |
| `temp_calculated_error_max`| Temp Calc Error +     | Upper uncertainty on calculated temperature           | K              |
| `temp_measured`            | Temp (Measured)       | Measured atmospheric temperature                      | K              |
| `hot_point_lon`            | Hot Point Longitude   | Longitude of hottest point on planet                  | degrees        |
| `geometric_albedo`         | Albedo                | Fraction of light reflected by planet                 | —              |
| `geometric_albedo_error_min`| Albedo Error -       | Lower uncertainty on albedo                           | —              |
| `geometric_albedo_error_max`| Albedo Error +       | Upper uncertainty on albedo                           | —              |
| `log_g`                    | log(g)                | Surface gravity (logarithmic)                         | log(cm/s²)     |
| `molecules`                | Detected Molecules    | Atmospheric molecules detected spectroscopically      | —              |

## Discovery & Publication

| **Field**                  | **Short Name**        | **Meaning**                                           | **Units**      |
| -------------------------- | --------------------- | ----------------------------------------------------- | -------------- |
| `discovered`               | Discovery Year        | Year of discovery                                     | year           |
| `updated`                  | Last Update           | Date of last catalog update (YYYY-MM-DD)              | —              |
| `publication`              | Publication Status    | Where findings were published                         | —              |
| `detection_type`           | Detection Method(s)   | Method(s) used to detect planet                       | —              |
| `mass_measurement_type`    | Mass Method           | Method used to measure mass                           | —              |
| `radius_measurement_type`  | Radius Method         | Method used to measure radius                         | —              |
| `alternate_names`          | Other Names           | Alternative designations for the planet               | —              |

**Common Detection Methods:**
- **Radial Velocity**: Star wobbles due to planet's gravity
- **Primary Transit**: Planet passes in front of star, dimming light
- **Imaging**: Direct photograph of the planet
- **Astrometry**: Precise measurement of star's position changes
- **Microlensing**: Gravitational lensing effect

## Host Star Properties

| **Field**                  | **Short Name**        | **Meaning**                                           | **Units**      |
| -------------------------- | --------------------- | ----------------------------------------------------- | -------------- |
| `star_name`                | Star Name             | Host star designation                                 | —              |
| `ra`                       | Right Ascension       | Star's RA coordinate (J2000 epoch)                    | degrees        |
| `dec`                      | Declination           | Star's Dec coordinate (J2000 epoch)                   | degrees        |
| `mag_v`                    | V Magnitude           | Visual magnitude (brightness in V band)               | mag            |
| `mag_i`                    | I Magnitude           | Magnitude in I band (near-infrared)                   | mag            |
| `mag_j`                    | J Magnitude           | Magnitude in J band (infrared)                        | mag            |
| `mag_h`                    | H Magnitude           | Magnitude in H band (infrared)                        | mag            |
| `mag_k`                    | K Magnitude           | Magnitude in K band (infrared)                        | mag            |
| `star_distance`            | Distance              | Distance from Earth to star                           | parsecs        |
| `star_distance_error_min`  | Distance Error -      | Lower uncertainty on distance                         | parsecs        |
| `star_distance_error_max`  | Distance Error +      | Upper uncertainty on distance                         | parsecs        |
| `star_metallicity`         | [Fe/H]                | Metallicity relative to Sun (0=solar)                 | dex            |
| `star_metallicity_error_min`| [Fe/H] Error -       | Lower uncertainty on metallicity                      | dex            |
| `star_metallicity_error_max`| [Fe/H] Error +       | Upper uncertainty on metallicity                      | dex            |
| `star_mass`                | Stellar Mass          | Mass of host star                                     | Solar masses   |
| `star_mass_error_min`      | Mass Error -          | Lower uncertainty on stellar mass                     | Solar masses   |
| `star_mass_error_max`      | Mass Error +          | Upper uncertainty on stellar mass                     | Solar masses   |
| `star_radius`              | Stellar Radius        | Radius of host star                                   | Solar radii    |
| `star_radius_error_min`    | Radius Error -        | Lower uncertainty on stellar radius                   | Solar radii    |
| `star_radius_error_max`    | Radius Error +        | Upper uncertainty on stellar radius                   | Solar radii    |
| `star_sp_type`             | Spectral Type         | Star classification (temperature & luminosity)        | —              |
| `star_age`                 | Age                   | Age of host star                                      | Gyr            |
| `star_age_error_min`       | Age Error -           | Lower uncertainty on stellar age                      | Gyr            |
| `star_age_error_max`       | Age Error +           | Upper uncertainty on stellar age                      | Gyr            |
| `star_teff`                | Effective Temperature | Surface temperature of star                           | K              |
| `star_teff_error_min`      | T_eff Error -         | Lower uncertainty on temperature                      | K              |
| `star_teff_error_max`      | T_eff Error +         | Upper uncertainty on temperature                      | K              |
| `star_detected_disc`       | Debris Disc           | Whether a debris disc has been detected               | —              |
| `star_magnetic_field`      | Magnetic Field        | Stellar magnetic field strength                       | —              |
| `star_alternate_names`     | Star Other Names      | Alternative designations for the star                 | —              |

---

**Note:** Empty fields in the catalog indicate data not yet available or not applicable to that particular planet/star system.
