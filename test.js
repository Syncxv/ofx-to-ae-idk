var test = [
  'name="Start"><OfxParamValue>0.500000 0.897133</OfxParamValue></OfxParamTypeDouble2D>',
  'name="End"><OfxParamValue>0.500000 0.102867</OfxParamValue></OfxParamTypeDouble2D>',
  'name="Start Color"><OfxParamValue>0.110000 0.762667 1.000000</OfxParamValue></OfxParamTypeRGB>',
  'name="End Color"><OfxParamValue>1.000000 0.330000 0.709667</OfxParamValue></OfxParamTypeRGB>',
  'name="Brightness"><OfxParamValue>2.000000</OfxParamValue></OfxParamTypeDouble>',
  'name="Add Noise"><OfxParamValue>64.000000</OfxParamValue></OfxParamTypeDouble>',
  'name="Smooth Curve"><OfxParamValue>1.000000</OfxParamValue></OfxParamTypeDouble>',
  'name="Bg Brightness"><OfxParamValue>1.000000</OfxParamValue></OfxParamTypeDouble>',
  'name="Combine"><OfxParamValue>1</OfxParamValue></OfxParamTypeChoice>',
  'name="Enable GPU"><OfxParamValue>true</OfxParamValue></OfxParamTypeBoolean>',
  'name="version"><OfxParamValue>6.100000</OfxParamValue></OfxParamTypeDouble>',
  'name="version2"><OfxParamValue>9860382</OfxParamValue></OfxParamTypeInteger>',
];
var bruh = [];
for (var g = 0; g < test.length; ++g) {
  var item = test[g];
  var name = item.match(/"\S.*"/gm)[0].replace(/"/g, "");
  //<\/|OfxParamValue>
  var value = item
    .match(/<OfxParamValue>.*<\/OfxParamValue>/gm)[0]
    .replace(/<\/.*|.OfxParamValue>/gm, "");
  bruh.push({ name, value });
}
