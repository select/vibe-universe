# Resources

- https://www.projectrho.com/public_html/starmaps/catalogues.php
- https://astronexus.com/projects/hyg

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
