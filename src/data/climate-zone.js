const climateZoneData = [
  {
    "subZone": "Af",
    "color": "#FFFFFF",
    "backgroundColor": "#960000",
    "group": "Tropical",
    "precipitationType": "Rainforest",
    "heatLevel": "",
    "shortDescription": "Tropical rainforest climate",
    "longDescription": "Average precipitation of at least 60 mm (2.4 in) in every month."
  },
  {
    "subZone": "Am",
    "color": "#FFFFFF",
    "backgroundColor": "#FF0000",
    "group": "Tropical",
    "precipitationType": "Monsoon",
    "heatLevel": "",
    "shortDescription": "Tropical monsoon climate",
    "longDescription": "The driest month (which nearly always occurs at or soon after the \"winter\" solstice for that side of the equator) with precipitation less than 60 mm (2.4 in), but more than 4% the total annual precipitation."
  },
  {
    "subZone": "As",
    "color": "#000000",
    "backgroundColor": "#FF6E6E",
    "group": "Tropical",
    "precipitationType": "Savanna, Dry",
    "heatLevel": "",
    "shortDescription": "Tropical dry savanna climate",
    "longDescription": "The driest month having precipitation less than 60 mm (2.4 in) and less than 4% of the total annual precipitation. The region may receive just enough precipitation during the short wet season to preclude it from a semi-arid climate classification. It may also have the dry season occurring during the time of higher sun and longer days often due to a rain shadow effect that cuts off summer precipitation in a tropical area, in which case it precludes it from having a tropical wet savanna climate."
  },
  {
    "subZone": "Aw",
    "color": "#000000",
    "backgroundColor": "#FFCCCC",
    "group": "Tropical",
    "precipitationType": "Savanna, Wet",
    "heatLevel": "",
    "shortDescription": "Tropical savanna, wet",
    "longDescription": "The driest month having precipitation less than 60 mm (2.4 in) and less than 4% of the total annual precipitation."
  },
  {
    "subZone": "BSh",
    "color": "#000000",
    "backgroundColor": "#CC8D14",
    "group": "Arid",
    "precipitationType": "Steppe",
    "heatLevel": "Hot",
    "shortDescription": "Hot semi-arid (steppe) climate",
    "longDescription": "Steppe climates are intermediates between desert climates (BW) and humid climates in ecological characteristics and agricultural potential. To determine if a location has a semi-arid climate, the precipitation threshold must first be determined. Finding the precipitation threshold (in millimeters) involves first multiplying the average annual temperature in °C by 20, then adding 280 if 70% or more of the total precipitation is in the high-sun half of the year (April through September in the Northern temperate zone, or October through March in the Southern), or 140 if 30%–70% of the total precipitation is received during the applicable period, or 0 if less than 30% of the total precipitation is so received. If the area's annual precipitation is less than the threshold but more than half the threshold, it is classified as a BS (steppe climate). Hot semi-arid climates have a mean annual temperature of at least 18°C, or a mean temperature greater than 0°C in the coldest month."
  },
  {
    "subZone": "BSk",
    "color": "#000000",
    "backgroundColor": "#CCAA54",
    "group": "Arid",
    "precipitationType": "Steppe",
    "heatLevel": "Cold",
    "shortDescription": "Cold semi-arid (steppe) climate",
    "longDescription": "Steppe climates are intermediates between desert climates (BW) and humid climates in ecological characteristics and agricultural potential. To determine if a location has a semi-arid climate, the precipitation threshold must first be determined. Finding the precipitation threshold (in millimeters) involves first multiplying the average annual temperature in °C by 20, then adding 280 if 70% or more of the total precipitation is in the high-sun half of the year (April through September in the Northern temperate zone, or October through March in the Southern), or 140 if 30%–70% of the total precipitation is received during the applicable period, or 0 if less than 30% of the total precipitation is so received. If the area's annual precipitation is less than the threshold but more than half the threshold, it is classified as a BS (steppe climate). Cold semi-arid climates have a mean annual temperature below 18°C, or a mean temperature of no more than 0°C in the coldest month."
  },
  {
    "subZone": "BWh",
    "color": "#000000",
    "backgroundColor": "FFCC00",
    "group": "Arid",
    "precipitationType": "Desert",
    "heatLevel": "Hot",
    "shortDescription": "Hot deserts climate",
    "longDescription": "Hot desert have a mean annual temperature of at least 18 °C and no more than 200mm of precipitation annually. These climates usually feature hot, sometimes exceptionally hot, periods of the year. In many locations featuring a hot desert climate, maximum temperatures of over 40 °C (104 °F) are not uncommon in summer and can soar to over 45 °C (113 °F) in the hottest regions."
  },
  {
    "subZone": "BWk",
    "color": "#000000",
    "backgroundColor": "#FFFF64",
    "group": "Arid",
    "precipitationType": "Desert",
    "heatLevel": "Cold",
    "shortDescription": "Cold desert climate",
    "longDescription": "Cold deserts have a mean annual temperature of less than 18 °C and no more than 200mm of precipitation annually. Cold desert climates usually feature hot (or warm in a few instances), dry summers, though summers are not typically as hot as hot desert climates. Unlike hot desert climates, cold desert climates tend to feature cold, dry winters."
  },
  {
    "subZone": "Cfa",
    "color": "#FFFFFF",
    "backgroundColor": "#007800",
    "group": "Temperate",
    "precipitationType": "Without dry season",
    "heatLevel": "Hot summer",
    "shortDescription": "Humid subtropical climate",
    "longDescription": "Temperate, without dry season, hot summer. With the coldest month averaging above 0 °C (32 °F), at least one month's average temperature above 22 °C (71.6 °F), and at least four months averaging above 10 °C (50 °F). No significant precipitation difference between seasons. No dry months in the summer."
  },
  {
    "subZone": "Cfb",
    "color": "#FFFFFF",
    "backgroundColor": "#005000",
    "group": "Temperate",
    "precipitationType": "Without dry season",
    "heatLevel": "Warm summer",
    "shortDescription": "Temperate oceanic climate",
    "longDescription": "Temperate, without dry season, warm summer. Coldest month averaging above 0 °C (32 °F), all months with average temperatures below 22 °C (71.6 °F), and at least four months averaging above 10 °C (50 °F). No significant precipitation difference between seasons."
  },
  {
    "subZone": "Cfc",
    "color": "#FFFFFF",
    "backgroundColor": "#003200",
    "group": "Temperate",
    "precipitationType": "Without dry season",
    "heatLevel": "Cold summer",
    "shortDescription": "Subpolar oceanic climate",
    "longDescription": "Temperate, without dry season, cold summer. The coldest month averaging above 0 °C (32 °F) and 1–3 months averaging above 10 °C (50 °F). No significant precipitation difference between seasons."
  },
  {
    "subZone": "Csa",
    "color": "#000000",
    "backgroundColor": "#96FF00",
    "group": "Temperate",
    "precipitationType": "Dry summer",
    "heatLevel": "Hot summer",
    "shortDescription": "Hot-summer Mediterranean climate",
    "longDescription": "Temperate, dry hot summer. The coldest month averaging above 0 °C (32 °F), at least one month's average temperature above 22 °C (71.6 °F), and at least four months averaging above 10 °C (50 °F). At least three times as much precipitation in the wettest month of winter as in the driest month of summer, and driest month of summer receives less than 30 mm (1.2 in)."
  },
  {
    "subZone": "Csb",
    "color": "#FFFFFF",
    "backgroundColor": "#00D700",
    "group": "Temperate",
    "precipitationType": "Dry summer",
    "heatLevel": "Warm summer",
    "shortDescription": "Warm-summer Mediterranean climate",
    "longDescription": "Temperate, dry warm summer  The coldest month averaging above 0 °C (32 °F), all months with average temperatures below 22 °C (71.6 °F), and at least four months averaging above 10 °C (50 °F)  At least three times as much precipitation in the wettest month of winter as in the driest month of summer, and driest month of summer receives less than 30 mm (1.2 in)."
  },
  {
    "subZone": "Csc",
    "color": "#FFFFFF",
    "backgroundColor": "#00AA00",
    "group": "Temperate",
    "precipitationType": "Dry summer",
    "heatLevel": "Cold summer",
    "shortDescription": "Cool-summer Mediterranean climate",
    "longDescription": "Temperate, dry cold summer. The coldest month averaging above 0 °C (32 °F) and 1–3 months averaging above 10 °C (50 °F). At least three times as much precipitation in the wettest month of winter as in the driest month of summer, and driest month of summer receives less than 30 mm (1.2 in)."
  },
  {
    "subZone": "Cwa",
    "color": "#000000",
    "backgroundColor": "#BEBE00",
    "group": "Temperate",
    "precipitationType": "Dry winter",
    "heatLevel": "Hot summer",
    "shortDescription": "Monsoon-influenced humid subtropical climate",
    "longDescription": "Temperate, dry winter, hot summer. The coldest month averaging above 0 °C (32 °F), at least one month's average temperature above 22 °C (71.6 °F), and at least four months averaging above 10 °C (50 °F). At least ten times as much rain in the wettest month of summer as in the driest month of winter (an alternative definition is 70% or more of average annual precipitation is received in the warmest six months)."
  },
  {
    "subZone": "Cwb",
    "color": "#FFFFFF",
    "backgroundColor": "#8C8C00",
    "group": "Temperate",
    "precipitationType": "Dry winter",
    "heatLevel": "Warm summer",
    "shortDescription": "Subtropical highland climate or temperate oceanic climate with dry winters",
    "longDescription": "Temperate, dry winter, warm summer. The coldest month averaging above 0 °C (32 °F), all months with average temperatures below 22 °C (71.6 °F), and at least four months averaging above 10 °C (50 °F). At least ten times as much rain in the wettest month of summer as in the driest month of winter (an alternative definition is 70% or more of average annual precipitation received in the warmest six months)."
  },
  {
    "subZone": "Cwc",
    "color": "#FFFFFF",
    "backgroundColor": "#5A5A00",
    "group": "Temperate",
    "precipitationType": "Dry winter",
    "heatLevel": "Cold summer",
    "shortDescription": "Cold subtropical highland climate or subpolar oceanic climate with dry winters",
    "longDescription": "Temperate, dry winter, cold summer. The coldest month averaging above 0 °C (32 °F) and 1–3 months averaging above 10 °C (50 °F). At least ten times as much rain in the wettest month of summer as in the driest month of winter (alternative definition is 70% or more of average annual precipitation is received in the warmest six months)."
  },
  {
    "subZone": "EF",
    "color": "#000000",
    "backgroundColor": "#6496FF",
    "group": "Polar",
    "precipitationType": "Ice cap",
    "heatLevel": "",
    "shortDescription": "Ice cap climate",
    "longDescription": "Polar eternal winter. With all 12 months of the year with average temperatures below 0 °C (32 °F)."
  },
  {
    "subZone": "ET",
    "color": "#000000",
    "backgroundColor": "#64FFFF",
    "group": "Polar",
    "precipitationType": "Tundra",
    "heatLevel": "",
    "shortDescription": "Tundra Polar",
    "longDescription": "Polar tundra. All 12 months of the year with average temperatures between 0 °C (32 °F) and 10 °C (50 °F)."
  },
  {
    "subZone": "Dfa",
    "color": "#FFFFFF",
    "backgroundColor": "#550055",
    "group": "Continental",
    "precipitationType": "Without dry season",
    "heatLevel": "Hot summer",
    "shortDescription": "Hot-summer humid continental climate",
    "longDescription": "Continental without dry season, hot summer. The coldest month averaging below 0 °C (32 °F), at least one month's average temperature above 22 °C (71.6 °F), and at least four months averaging above 10 °C (50 °F). No significant precipitation difference between seasons."
  },
  {
    "subZone": "Dfb",
    "color": "#FFFFFF",
    "backgroundColor": "#820082",
    "group": "Continental",
    "precipitationType": "Without dry season",
    "heatLevel": "Warm summer",
    "shortDescription": "Warm-summer humid continental climate",
    "longDescription": "Continental without dry season, warm summer. The coldest month averaging below 0 °C (32 °F), all months with average temperatures below 22 °C (71.6 °F), and at least four months averaging above 10 °C (50 °F). No significant precipitation difference between seasons."
  },
  {
    "subZone": "Dfc",
    "color": "#FFFFFF",
    "backgroundColor": "#C800C8",
    "group": "Continental",
    "precipitationType": "Without dry season",
    "heatLevel": "Cold summer",
    "shortDescription": "Subarctic climate",
    "longDescription": "Continental without dry season, cold summer. The coldest month averaging below 0 °C (32 °F) and 1–3 months averaging above 10 °C (50 °F). No significant precipitation difference between seasons."
  },
  {
    "subZone": "Dfd",
    "color": "#000000",
    "backgroundColor": "#FF6EFF",
    "group": "Continental",
    "precipitationType": "Without dry season",
    "heatLevel": "Very cold winter",
    "shortDescription": "Extremely cold subarctic climate",
    "longDescription": "Continental without dry season, very cold winter. The coldest month averaging below ?38 °C (?36.4 °F) and 1–3 months averaging above 10 °C (50 °F). No significant precipitation difference between seasons."
  },
  {
    "subZone": "Dsa",
    "color": "#FFFFFF",
    "backgroundColor": "#646464",
    "group": "Continental",
    "precipitationType": "Dry summer",
    "heatLevel": "Hot summer",
    "shortDescription": "Hot, dry-summer continental climate",
    "longDescription": "Continental, dry hot summer. The coldest month averaging below 0 °C (32 °F), at least one month's average temperature above 22 °C (71.6 °F), and at least four months averaging above 10 °C (50 °F). At least three times as much precipitation in the wettest month of winter as in the driest month of summer, and driest month of summer receives less than 30 mm (1.2 in)."
  },
  {
    "subZone": "Dsb",
    "color": "#FFFFFF",
    "backgroundColor": "#8C8C8C",
    "group": "Continental",
    "precipitationType": "Dry summer",
    "heatLevel": "Warm summer",
    "shortDescription": "Warm, dry-summer continental climate",
    "longDescription": "Continental, dry warm summer. The coldest month averaging below 0 °C (32 °F), all months with average temperatures below 22 °C (71.6 °F), and at least four months averaging above 10 °C (50 °F). At least three times as much precipitation in the wettest month of winter as in the driest month of summer, and driest month of summer receives less than 30 mm (1.2 in)."
  },
  {
    "subZone": "Dsc",
    "color": "#000000",
    "backgroundColor": "#BEBEBE",
    "group": "Continental",
    "precipitationType": "Dry summer",
    "heatLevel": "Cold summer",
    "shortDescription": "Dry-summer subarctic climate",
    "longDescription": "Continental, dry cold summer. The coldest month averaging below 0 °C (32 °F) and 1–3 months averaging above 10 °C (50 °F). At least three times as much precipitation in the wettest month of winter as in the driest month of summer, and driest month of summer receives less than 30 mm (1.2 in)."
  },
  {
    "subZone": "Dwa",
    "color": "#FFFFFF",
    "backgroundColor": "#6E28B4",
    "group": "Continental",
    "precipitationType": "Dry winter",
    "heatLevel": "Hot summer",
    "shortDescription": "Monsoon-influenced hot-summer humid continental climate",
    "longDescription": "Continental, dry winter, hot summer. The coldest month averaging below 0 °C (32 °F), at least one month's average temperature above 22 °C (71.6 °F), and at least four months averaging above 10 °C (50 °F). At least ten times as much rain in the wettest month of summer as in the driest month of winter (alternative definition is 70% or more of average annual precipitation is received in the warmest six months)."
  },
  {
    "subZone": "Dwb",
    "color": "#FFFFFF",
    "backgroundColor": "#B464FA",
    "group": "Continental",
    "precipitationType": "Dry winter",
    "heatLevel": "Warm summer",
    "shortDescription": "Monsoon-influenced warm-summer humid continental climate. Continental",
    "longDescription": "old (continental), dry winter, warm summer. The coldest month averaging below 0 °C (32 °F), all months with average temperatures below 22 °C (71.6 °F), and at least four months averaging above 10 °C (50 °F). At least ten times as much rain in the wettest month of summer as in the driest month of winter (an alternative definition is 70% or more of average annual precipitation is received in the warmest six months)."
  },
  {
    "subZone": "Dwc",
    "color": "#000000",
    "backgroundColor": "#C89BFA",
    "group": "Continental",
    "precipitationType": "Dry winter",
    "heatLevel": "Cold summer",
    "shortDescription": "Monsoon-influenced subarctic climate Continental",
    "longDescription": "Continental, dry winter, cold summer. The coldest month averaging below 0 °C (32 °F) and 1–3 months averaging above 10 °C (50 °F). At least ten times as much rain in the wettest month of summer as in the driest month of winter (an alternative definition is 70% or more of average annual precipitation is received in the warmest six months)."
  },
  {
    "subZone": "Dwd",
    "color": "#000000",
    "backgroundColor": "#C8C8FF",
    "group": "Continental",
    "precipitationType": "Dry winter",
    "heatLevel": "Very cold winter",
    "shortDescription": "Monsoon-influenced extremely cold subarctic climate",
    "longDescription": "Continental, very cold dry winter. The coldest month averaging below ?38 °C (?36.4 °F) and 1–3 months averaging above 10 °C (50 °F). At least ten times as much rain in the wettest month of summer as in the driest month of winter (alternative definition is 70% or more of average annual precipitation is received in the warmest six months)."
  }
]

export default climateZoneData