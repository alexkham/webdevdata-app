export const initialState = {
    inputValue: '',
    fromUnit: 'Select Unit',
    toUnit: 'Select Unit',
    result: '',
    additionalFields: {
      'Parent Size (emSize)': '16',
      'Root Size (remSize)': '16',
      'Base Size for %': '100',
      'Viewport Width': '1920',
      'Viewport Height': '1080'
    }
  };
  
  export const units = ['Select Unit', 'px', 'em', 'rem', 'pt', 'pc', 'in', 'cm', 'mm', '%', 'vw', 'vh'];
  
  export const requiredFields = {
    'em-to-px': ['Parent Size (emSize)'],
    'em-to-rem': ['Parent Size (emSize)', 'Root Size (remSize)'],
    'em-to-%': ['Parent Size (emSize)', 'Base Size for %'],
    'em-to-vw': ['Parent Size (emSize)', 'Viewport Width'],
    'em-to-vh': ['Parent Size (emSize)', 'Viewport Height'],
    'rem-to-px': ['Root Size (remSize)'],
    'rem-to-em': ['Root Size (remSize)', 'Parent Size (emSize)'],
    'rem-to-%': ['Root Size (remSize)', 'Base Size for %'],
    'rem-to-vw': ['Root Size (remSize)', 'Viewport Width'],
    'rem-to-vh': ['Root Size (remSize)', 'Viewport Height'],
    'px-to-em': ['Parent Size (emSize)'],
    'px-to-rem': ['Root Size (remSize)'],
    'px-to-%': ['Base Size for %'],
    'px-to-vw': ['Viewport Width'],
    'px-to-vh': ['Viewport Height'],
    'pt-to-em': ['Parent Size (emSize)'],
    'pt-to-rem': ['Root Size (remSize)'],
    'pt-to-%': ['Base Size for %'],
    'pt-to-vw': ['Viewport Width'],
    'pt-to-vh': ['Viewport Height'],
    'pc-to-em': ['Parent Size (emSize)'],
    'pc-to-rem': ['Root Size (remSize)'],
    'pc-to-%': ['Base Size for %'],
    'pc-to-vw': ['Viewport Width'],
    'pc-to-vh': ['Viewport Height'],
    'in-to-em': ['Parent Size (emSize)'],
    'in-to-rem': ['Root Size (remSize)'],
    'in-to-%': ['Base Size for %'],
    'in-to-vw': ['Viewport Width'],
    'in-to-vh': ['Viewport Height'],
    'cm-to-em': ['Parent Size (emSize)'],
    'cm-to-rem': ['Root Size (remSize)'],
    'cm-to-%': ['Base Size for %'],
    'cm-to-vw': ['Viewport Width'],
    'cm-to-vh': ['Viewport Height'],
    'mm-to-em': ['Parent Size (emSize)'],
    'mm-to-rem': ['Root Size (remSize)'],
    'mm-to-%': ['Base Size for %'],
    'mm-to-vw': ['Viewport Width'],
    'mm-to-vh': ['Viewport Height'],
    '%-to-px': ['Base Size for %'],
    '%-to-em': ['Base Size for %', 'Parent Size (emSize)'],
    '%-to-rem': ['Base Size for %', 'Root Size (remSize)'],
    '%-to-pt': ['Base Size for %'],
    '%-to-pc': ['Base Size for %'],
    '%-to-in': ['Base Size for %'],
    '%-to-cm': ['Base Size for %'],
    '%-to-mm': ['Base Size for %'],
    '%-to-vw': ['Base Size for %', 'Viewport Width'],
    '%-to-vh': ['Base Size for %', 'Viewport Height'],
    'vw-to-px': ['Viewport Width'],
    'vw-to-em': ['Viewport Width', 'Parent Size (emSize)'],
    'vw-to-rem': ['Viewport Width', 'Root Size (remSize)'],
    'vw-to-pt': ['Viewport Width'],
    'vw-to-pc': ['Viewport Width'],
    'vw-to-in': ['Viewport Width'],
    'vw-to-cm': ['Viewport Width'],
    'vw-to-mm': ['Viewport Width'],
    'vw-to-%': ['Viewport Width', 'Base Size for %'],
    'vw-to-vh': ['Viewport Width', 'Viewport Height'],
    'vh-to-px': ['Viewport Height'],
    'vh-to-em': ['Viewport Height', 'Parent Size (emSize)'],
    'vh-to-rem': ['Viewport Height', 'Root Size (remSize)'],
    'vh-to-pt': ['Viewport Height'],
    'vh-to-pc': ['Viewport Height'],
    'vh-to-in': ['Viewport Height'],
    'vh-to-cm': ['Viewport Height'],
    'vh-to-mm': ['Viewport Height'],
    'vh-to-%': ['Viewport Height', 'Base Size for %'],
    'vh-to-vw': ['Viewport Height', 'Viewport Width'],
  };
  
  export const tooltips = {
    'Parent Size (emSize)': "The font size of the parent element in pixels. Default is 16px, which is the standard browser default font size.",
    'Root Size (remSize)': "The font size of the root element (html) in pixels. Default is 16px, which is the standard browser default font size.",
    'Base Size for %': "The reference size for percentage calculations in pixels. Default is 100px for easier mental math.",
    'Viewport Width': "The width of the viewport in pixels. Default is 1920px, a common screen width.",
    'Viewport Height': "The height of the viewport in pixels. Default is 1080px, a common screen height."
  };
  
//   export const unitExplanations = {
//     'px': 'Pixels are the most common unit. One pixel is equal to one dot on the computer screen.',
//     'em': 'Relative to the font-size of the element (2em means 2 times the size of the current font).',
//     'rem': 'Relative to font-size of the root element.',
//     'pt': 'Points. 1pt is equal to 1/72 of an inch.',
//     'pc': 'Picas. 1pc is equal to 12 points.',
//     'in': 'Inches. 1in is equal to 96px on a 96 DPI display.',
//     'cm': 'Centimeters. 1cm is approximately 37.8px on a 96 DPI display.',
//     'mm': 'Millimeters. 1mm is approximately 3.78px on a 96 DPI display.',
//     '%': 'Percentage, relative to the parent element.',
//     'vw': 'Viewport width. 1vw is 1% of the viewport\'s width.',
//     'vh': 'Viewport height. 1vh is 1% of the viewport\'s height.',
//   };


  // data.js

// ... (keep existing exports)

export const unitExplanations = {
    'px': 'Pixels are the most common unit of measure for screen display. One pixel represents a single point of light on a digital display, often used to define the size of text, images, and layout components in web and graphic design. For example, setting the width of an image to 100px makes it 100 pixels wide on the display.',
  
    'em': 'An "em" is a scalable unit that is used in web document media for expressing the size of fonts and other items relative to the current font size. If the parent element has a font size of 16 pixels, then 1em equals 16 pixels. For example, setting a margin of 2em would yield a 32-pixel margin if the parent font size is 16px.',
  
    'rem': 'Relative to the font-size of the root element (usually the html element). It is useful for maintaining consistent sizes across different components of an application. For instance, if the root font size is set to 20px, 1rem would equal 20px, making it easy to scale all text by adjusting the root font size.',
  
    'pt': 'Points are a unit of measurement traditionally used in print media (about 1/72 of an inch) and often used for specifying font sizes. A point is roughly 1.333 pixels when the display is set to 96 DPI (dots per inch). For example, setting a font size of 12pt is approximately equal to 16px on a screen display.',
  
    'pc': 'Picas are a typographic measurement used especially in graphic design for print media. One pica equals 12 points or approximately 1/6 of an inch. This makes it a good unit for designing printed pages. For example, using 2pc in a layout would translate to about 1/3 of an inch.',
  
    'in': 'Inches are a measurement unit that directly corresponds to physical sizes in the real world. One inch is defined as 96 pixels on a screen with a standard display of 96 DPI. This unit is often used in printing rather than web design. For instance, defining a page margin of 1in in a CSS style would set that margin to 96 pixels on a standard screen.',
  
    'cm': 'Centimeters are part of the metric system and are used in many countries worldwide to measure small distances. On screens, one centimeter is approximately 37.8 pixels based on a standard 96 DPI screen. This unit is practical for designs that need to relate closely to physical dimensions, such as in printing layouts.',
  
    'mm': 'Millimeters are a smaller metric unit, ideal for precise dimensions in design, especially print. On a standard 96 DPI screen, 1mm translates to about 3.78 pixels. For example, setting a border width of 2mm in a print stylesheet ensures a thin, precise border of about 7.56 pixels.',
  
    '%': 'Percentage is a relative unit used primarily for responsive web design. It sets sizes relative to parent elements, allowing flexibility and adaptability in layouts across different screen sizes. For instance, setting a width of 50% would make an element cover half of its parent’s width, adapting dynamically to varying screen sizes.',
  
    'vw': 'Viewport width units represent 1% of the viewport’s width, allowing for fluid sizing of elements relative to the overall browser window. This unit is highly useful for creating responsive designs that adjust smoothly across different screen sizes. For example, setting a width of 10vw would give an element a width that is always 10% of the viewport’s current width.',
  
    'vh': 'Viewport height units, like vw, represent 1% of the viewport’s height. They are used to size elements based on the height of the browser window, which is particularly useful for creating designs that need to scale in vertical space. Setting the height of a header to 10vh, for example, ensures it always takes up 10% of the viewport’s height, regardless of device.',
  };
  

export const conversionExplanations = {
    // 'px-to-em': 'To convert px to em, divide the px value by the parent element\'s font size in pixels.',
    // 'em-to-px': 'To convert em to px, multiply the em value by the parent element\'s font size in pixels.',
    // 'px-to-rem': 'To convert px to rem, divide the px value by the root element\'s font size in pixels.',
    // 'rem-to-px': 'To convert rem to px, multiply the rem value by the root element\'s font size in pixels.',
    // 'px-to-%': 'To convert px to %, divide the px value by the parent element\'s relevant dimension (width or height) and multiply by 100.',
    // '%-to-px': 'To convert % to px, multiply the % value by the parent element\'s relevant dimension (width or height) and divide by 100.',
    
    'px-to-px': 'No conversion is performed as both the source and target units are pixels (px). Please select different units if conversion is needed.',
    'em-to-em': 'No conversion is performed as both the source and target units are em. Please select different units to see conversion effects.',
    'rem-to-rem': 'No conversion is performed as both the source and target units are rem. To convert values, please choose differing source and target units.',
    'pt-to-pt': 'No conversion is performed as both the source and target units are points (pt). Select different units for conversion purposes.',
    'pc-to-pc': 'No conversion is performed as both the source and target units are picas (pc). Conversion requires different source and target units.',
    'in-to-in': 'No conversion is performed as both the source and target units are inches. Please choose different units to perform a conversion.',
    'cm-to-cm': 'No conversion is performed as both the source and target units are centimeters (cm). To convert, different units must be selected.',
    'mm-to-mm': 'No conversion is performed as both the source and target units are millimeters (mm). Select different units to enable conversion.',
    '%-to-%': 'No conversion is performed as both the source and target units are percentages (%). Please select different units for conversion.',
    'vw-to-vw': 'No conversion is performed as both the source and target units are viewport widths (vw). Choose different units to carry out a conversion.',
    'vh-to-vh': 'No conversion is performed as both the source and target units are viewport heights (vh). Different units are required for conversion.',

    //px

    'px-to-em': 'To convert pixels (px) to em, divide the pixel value by the parent element\'s font size in pixels. This represents the size relative to the font size of the element.',
    'px-to-rem': 'To convert pixels (px) to rem, divide the pixel value by the root element\'s font size in pixels. Useful for scaling elements relative to the base font size of the document.',
    'px-to-pt': 'To convert pixels (px) to points (pt), multiply the pixel value by 0.75 (assuming 96 DPI, where 1pt equals 1/72 of an inch and 1px equals 1/96 of an inch).',
    'px-to-pc': 'To convert pixels (px) to picas (pc), first convert pixels to points, then divide by 12 since 1 pica equals 12 points.',
    'px-to-in': 'To convert pixels (px) to inches (in), divide the pixel value by the DPI (dots per inch) of the display, usually 96 DPI, meaning 1 inch equals 96 pixels.',
    'px-to-cm': 'To convert pixels (px) to centimeters (cm), divide the pixel value by the pixels per centimeter based on the DPI (1 inch equals 2.54 cm, so for 96 DPI, 1 cm equals approximately 37.8 pixels).',
    'px-to-mm': 'To convert pixels (px) to millimeters (mm), use the same conversion as for centimeters but multiply the result by 10, since 10 mm equals 1 cm.',
    'px-to-%': 'To convert pixels (px) to percent (%), divide the pixel value by the reference dimension (like the width or height of a parent element) and multiply by 100 to get a percentage.',
    'px-to-vw': 'To convert pixels (px) to viewport widths (vw), divide the pixel value by the width of the viewport in pixels and multiply by 100 to convert it into a percentage of the viewport width.',
    'px-to-vh': 'To convert pixels (px) to viewport heights (vh), divide the pixel value by the height of the viewport in pixels and multiply by 100 to convert it into a percentage of the viewport height.',

    //rem

    'rem-to-px': 'To convert rem to pixels (px), multiply the rem value by the root element\'s font size in pixels. This conversion reflects the rem unit\'s relation to the base font size of the document.',
    'rem-to-em': 'To convert rem to em, multiply the rem value by the ratio of the root element\'s font size to the parent element\'s font size. This helps adapt rem-based sizes to local font-size contexts.',
    'rem-to-vw': 'To convert rem to viewport width (vw), first convert rem to pixels based on the root font size, then divide by the viewport width in pixels and multiply by 100 to convert it into a percentage of the viewport width.',
    'rem-to-vh': 'To convert rem to viewport height (vh), first convert rem to pixels based on the root font size, then divide by the viewport height in pixels and multiply by 100 to convert it into a percentage of the viewport height.',
    'rem-to-pt': 'To convert rem to points (pt), first convert rem to pixels, then multiply by 0.75 (assuming 96 DPI, where 1pt equals 1/72 of an inch).',
    'rem-to-in': 'To convert rem to inches (in), convert the rem value to pixels and then divide by the DPI of the display, typically assumed to be 96 DPI, meaning 1 inch equals 96 pixels.',
    'rem-to-pc': 'To convert rem to picas (pc), first convert rem to points and then divide by 12, since 1 pica equals 12 points, reflecting the typographic scale used in print.',
    'rem-to-cm': 'To convert rem to centimeters (cm), first convert rem to pixels and then divide by the number of pixels per centimeter (approximately 37.8 at 96 DPI).',
    'rem-to-mm': 'To convert rem to millimeters (mm), first convert rem to centimeters, then multiply by 10, since 10 mm make up 1 cm, providing a direct metric conversion.',
    'rem-to-%': 'To convert rem to percent (%), calculate the pixel equivalent of the rem value and then divide by the relevant dimension (like the width or height of a parent element) of the reference layout and multiply by 100 to express it as a percentage.',

     //em

    'em-to-px': 'To convert em to pixels (px), multiply the em value by the font size of the parent element in pixels. This reflects the direct relationship between em and the local font size setting.',
    'em-to-rem': 'To convert em to rem, divide the em value by the ratio of the parent element\'s font size to the root element\'s font size. This conversion adapts em-based sizes to be relative to the base font size of the document.',
    'em-to-vw': 'To convert em to viewport width (vw), first convert em to pixels using the parent element\'s font size, then divide by the viewport width in pixels and multiply by 100 to express it as a percentage of the viewport width.',
    'em-to-vh': 'To convert em to viewport height (vh), first convert em to pixels using the parent element\'s font size, then divide by the viewport height in pixels and multiply by 100 to express it as a percentage of the viewport height.',
    'em-to-pt': 'To convert em to points (pt), first convert em to pixels, then multiply by 0.75 if the display is set to 96 DPI (where 1pt equals 1/72 of an inch, and 1px equals 1/96 of an inch).',
    'em-to-in': 'To convert em to inches (in), convert the em value to pixels and then divide by the DPI of the display, which is typically 96 DPI, equating 1 inch to 96 pixels.',
    'em-to-pc': 'To convert em to picas (pc), first convert em to points and then divide by 12, as 1 pica equals 12 points, a standard measure used in typography.',
    'em-to-cm': 'To convert em to centimeters (cm), first convert em to pixels, then divide by the number of pixels per centimeter, which is approximately 37.8 at 96 DPI.',
    'em-to-mm': 'To convert em to millimeters (mm), first convert em to centimeters, then multiply by 10, since 10 mm make up 1 cm, facilitating a metric scale conversion.',
    'em-to-%': 'To convert em to percent (%), first calculate the pixel equivalent of the em value based on the parent\'s font size, then divide by the reference dimension (such as the width or height of a parent element) and multiply by 100 to convert it into a percentage.',
     
    //vw

    'vw-to-px': 'To convert viewport width (vw) to pixels (px), multiply the vw value by the width of the viewport in pixels divided by 100. For example, if the viewport is 1920 pixels wide, 1vw equals 19.2 pixels.',
    'vw-to-rem': 'To convert vw to rem, first convert vw to pixels based on the current viewport width, then divide by the root element\'s font size in pixels to get the measurement in rems.',
    'vw-to-em': 'To convert vw to em, first convert vw to pixels using the viewport width, then divide by the parent element\'s font size in pixels. This adjusts the vw measurement to be relative to the local font size.',
    'vw-to-vh': 'To convert vw to vh (viewport height), divide the vw value by the viewport width and multiply by the viewport height. This conversion reflects the proportional relationship between the width and height of the viewport.',
    'vw-to-pt': 'To convert vw to points (pt), first convert vw to pixels and then multiply by 0.75 if the display is set to 96 DPI (where 1pt equals 1/72 of an inch, and 1px equals 1/96 of an inch).',
    'vw-to-in': 'To convert vw to inches (in), convert the vw value to pixels and then divide by the DPI of the display, typically assumed to be 96 DPI, where 1 inch equals 96 pixels.',
    'vw-to-pc': 'To convert vw to picas (pc), first convert vw to points and then divide by 12, since 1 pica equals 12 points, a common typographical measure.',
    'vw-to-cm': 'To convert vw to centimeters (cm), first convert vw to pixels, then divide by the number of pixels per centimeter, approximately 37.8 at 96 DPI.',
    'vw-to-mm': 'To convert vw to millimeters (mm), first convert vw to centimeters, then multiply by 10, as 10 mm equals 1 cm, providing a straightforward metric conversion.',
    'vw-to-%': 'To convert vw to percent (%), simply multiply the vw value by 100 to express it as a percentage of the viewport width, since 1vw already represents 1% of the viewport width.',

     //vh
     'vh-to-px': 'To convert viewport height (vh) to pixels (px), multiply the vh value by the height of the viewport in pixels divided by 100. For example, if the viewport is 1080 pixels high, 1vh equals 10.8 pixels.',
    'vh-to-rem': 'To convert vh to rem, first convert vh to pixels based on the current viewport height, then divide by the root element\'s font size in pixels to determine the measurement in rems.',
    'vh-to-em': 'To convert vh to em, first convert vh to pixels using the viewport height, then divide by the parent element\'s font size in pixels. This allows the vh measurement to adapt to the local font size context.',
    'vh-to-vw': 'To convert vh to vw (viewport width), divide the vh value by the viewport height and multiply by the viewport width. This conversion reflects the proportional relationship between the height and width of the viewport.',
    'vh-to-pt': 'To convert vh to points (pt), first convert vh to pixels and then multiply by 0.75 if the display is set to 96 DPI (where 1pt equals 1/72 of an inch, and 1px equals 1/96 of an inch).',
    'vh-to-in': 'To convert vh to inches (in), convert the vh value to pixels and then divide by the DPI of the display, typically assumed to be 96 DPI, where 1 inch equals 96 pixels.',
    'vh-to-pc': 'To convert vh to picas (pc), first convert vh to points and then divide by 12, since 1 pica equals 12 points, a common measure used in typography.',
    'vh-to-cm': 'To convert vh to centimeters (cm), first convert vh to pixels, then divide by the number of pixels per centimeter, approximately 37.8 at 96 DPI.',
    'vh-to-mm': 'To convert vh to millimeters (mm), first convert vh to centimeters, then multiply by 10, as 10 mm equals 1 cm, making it a direct metric conversion.',
    'vh-to-%': 'To convert vh to percent (%), simply multiply the vh value by 100 to express it as a percentage of the viewport height, since 1vh already represents 1% of the viewport height.',

    //pt

    'pt-to-px': 'To convert points (pt) to pixels (px), multiply the point value by 1.333, assuming the display is set to 96 DPI (where 1pt equals 1/72 of an inch and 1px equals 1/96 of an inch). For example, 10pt converts to approximately 13.33px.',
    'pt-to-rem': 'To convert points (pt) to rem, first convert pt to pixels, then divide by the root element\'s font size in pixels. This conversion adapts the measurement to be relative to the base font size of the document.',
    'pt-to-em': 'To convert points (pt) to em, first convert pt to pixels, then divide by the parent element\'s font size in pixels. This allows the point measurement to be expressed relative to the local font size setting.',
    'pt-to-vw': 'To convert points (pt) to viewport width (vw), first convert pt to pixels, then divide by the viewport width in pixels and multiply by 100 to express it as a percentage of the viewport width.',
    'pt-to-vh': 'To convert points (pt) to viewport height (vh), first convert pt to pixels, then divide by the viewport height in pixels and multiply by 100 to express it as a percentage of the viewport height.',
    'pt-to-in': 'To convert points (pt) to inches (in), simply divide the point value by 72, as there are 72 points in an inch. This provides a direct conversion to physical dimensions used in printing.',
    'pt-to-pc': 'To convert points (pt) to picas (pc), divide the point value by 12, since 1 pica equals 12 points. This is a straightforward conversion used often in typography.',
    'pt-to-cm': 'To convert points (pt) to centimeters (cm), first convert points to inches, then multiply by 2.54, as there are 2.54 centimeters in an inch. This reflects the metric system conversion.',
    'pt-to-mm': 'To convert points (pt) to millimeters (mm), convert points to centimeters first, then multiply by 10, as 10 mm make up 1 cm, facilitating an easy metric scale conversion.',
    'pt-to-%': 'To convert points (pt) to percent (%), convert points to a relevant measurement such as pixels, then divide by the reference dimension (such as the width or height of a parent element) and multiply by 100 to express it as a percentage.',

     //in

     'in-to-px': 'To convert inches (in) to pixels (px), multiply the inch value by the DPI (dots per inch) setting of your display, which is commonly 96 DPI for web displays. For example, 1 inch converts to 96 pixels under these conditions.',
    'in-to-rem': 'To convert inches (in) to rem, first convert inches to pixels based on the DPI setting, then divide by the root element\'s font size in pixels. This adapts the inch measurement to the document\'s base font size.',
    'in-to-em': 'To convert inches (in) to em, first convert inches to pixels, then divide by the parent element\'s font size in pixels. This conversion expresses the inch measurement relative to the local font size.',
    'in-to-vw': 'To convert inches (in) to viewport width (vw), first convert inches to pixels, then divide by the viewport width in pixels and multiply by 100 to express it as a percentage of the viewport width.',
    'in-to-vh': 'To convert inches (in) to viewport height (vh), first convert inches to pixels, then divide by the viewport height in pixels and multiply by 100 to express it as a percentage of the viewport height.',
    'in-to-pt': 'To convert inches (in) to points (pt), multiply the inch value by 72, as there are 72 points in one inch. This provides a direct conversion suitable for typography and printing.',
    'in-to-pc': 'To convert inches (in) to picas (pc), multiply the inch value by 6, since there are 6 picas in an inch (and 12 points in a pica). This is a straightforward conversion used in graphic design and typesetting.',
    'in-to-cm': 'To convert inches (in) to centimeters (cm), multiply the inch value by 2.54, as there are 2.54 centimeters in an inch. This reflects the metric system conversion used globally.',
    'in-to-mm': 'To convert inches (in) to millimeters (mm), multiply the inch value by 25.4, since there are 25.4 millimeters in an inch, providing a precise metric conversion for detailed measurements.',
    'in-to-%': 'To convert inches (in) to percent (%), convert inches to a relevant measurement such as pixels, then divide by the reference dimension (such as the width or height of a parent element) and multiply by 100 to express it as a percentage.',
    
    //pc
    'pc-to-px': 'To convert picas (pc) to pixels (px), multiply the pica value by 16, assuming a standard display where 1 pica equals 12 points and 1 point equals 1.333 pixels at 96 DPI.',
    'pc-to-rem': 'To convert picas (pc) to rem, first convert picas to pixels using the conversion of 16 pixels per pica, then divide by the root element\'s font size in pixels. This adapts the pica measurement to the base font size of the document.',
    'pc-to-em': 'To convert picas (pc) to em, first convert picas to pixels, then divide by the parent element\'s font size in pixels. This allows the pica measurement to be expressed relative to the local font size setting.',
    'pc-to-vw': 'To convert picas (pc) to viewport width (vw), first convert picas to pixels, then divide by the viewport width in pixels and multiply by 100 to express it as a percentage of the viewport width.',
    'pc-to-vh': 'To convert picas (pc) to viewport height (vh), first convert picas to pixels, then divide by the viewport height in pixels and multiply by 100 to express it as a percentage of the viewport height.',
    'pc-to-pt': 'To convert picas (pc) to points (pt), multiply the pica value by 12, as there are 12 points in one pica. This is a direct and commonly used conversion in typography.',
    'pc-to-in': 'To convert picas (pc) to inches (in), divide the pica value by 6, since there are 6 picas in an inch. This conversion is straightforward and reflects traditional measurement relationships in printing.',
    'pc-to-cm': 'To convert picas (pc) to centimeters (cm), first convert picas to inches, then multiply by 2.54, as there are 2.54 centimeters in an inch. This adapts picas to the metric system.',
    'pc-to-mm': 'To convert picas (pc) to millimeters (mm), first convert picas to centimeters and then multiply by 10, since 10 mm make up 1 cm. This facilitates an easy metric scale conversion.',
    'pc-to-%': 'To convert picas (pc) to percent (%), convert picas to a relevant measurement such as pixels, then divide by the reference dimension (such as the width or height of a parent element) and multiply by 100 to express it as a percentage.',

     //cm
     'cm-to-px': 'To convert centimeters (cm) to pixels (px), multiply the centimeter value by the number of pixels per centimeter, typically calculated based on a standard display of 96 DPI, where 1 cm approximately equals 37.8 pixels.',
    'cm-to-rem': 'To convert centimeters (cm) to rem, first convert cm to pixels using the conversion factor (approximately 37.8 pixels per cm at 96 DPI), then divide by the root element\'s font size in pixels. This adapts the cm measurement to the base font size of the document.',
    'cm-to-em': 'To convert centimeters (cm) to em, first convert cm to pixels, then divide by the parent element\'s font size in pixels. This allows the cm measurement to be expressed relative to the local font size setting.',
    'cm-to-vw': 'To convert centimeters (cm) to viewport width (vw), first convert cm to pixels, then divide by the viewport width in pixels and multiply by 100 to express it as a percentage of the viewport width.',
    'cm-to-vh': 'To convert centimeters (cm) to viewport height (vh), first convert cm to pixels, then divide by the viewport height in pixels and multiply by 100 to express it as a percentage of the viewport height.',
    'cm-to-pt': 'To convert centimeters (cm) to points (pt), first convert cm to inches (1 inch equals 2.54 cm), then multiply by 72, as there are 72 points in one inch. This provides a direct conversion useful in printing and typography.',
    'cm-to-in': 'To convert centimeters (cm) to inches (in), divide the centimeter value by 2.54, as there are 2.54 centimeters in an inch. This conversion is straightforward and commonly used in various fields including printing.',
    'cm-to-pc': 'To convert centimeters (cm) to picas (pc), first convert cm to inches, then multiply by 6, since there are 6 picas in an inch. This is a commonly used conversion in graphic design and typesetting.',
    'cm-to-mm': 'To convert centimeters (cm) to millimeters (mm), multiply the centimeter value by 10, as 10 mm make up 1 cm. This is a straightforward metric conversion.',
    'cm-to-%': 'To convert centimeters (cm) to percent (%), convert cm to a relevant measurement such as pixels, then divide by the reference dimension (such as the width or height of a parent element) and multiply by 100 to express it as a percentage.',

     //mm
     'mm-to-px': 'To convert millimeters (mm) to pixels (px), multiply the millimeter value by the number of pixels per millimeter, typically based on a display of 96 DPI, where 1 mm approximately equals 3.78 pixels.',
    'mm-to-rem': 'To convert millimeters (mm) to rem, first convert mm to pixels using the conversion factor (approximately 3.78 pixels per mm at 96 DPI), then divide by the root element\'s font size in pixels. This adapts the mm measurement to the document’s base font size.',
    'mm-to-em': 'To convert millimeters (mm) to em, first convert mm to pixels, then divide by the parent element\'s font size in pixels. This allows the mm measurement to be expressed relative to the local font size.',
    'mm-to-vw': 'To convert millimeters (mm) to viewport width (vw), first convert mm to pixels, then divide by the viewport width in pixels and multiply by 100 to express it as a percentage of the viewport width.',
    'mm-to-vh': 'To convert millimeters (mm) to viewport height (vh), first convert mm to pixels, then divide by the viewport height in pixels and multiply by 100 to express it as a percentage of the viewport height.',
    'mm-to-pt': 'To convert millimeters (mm) to points (pt), first convert mm to inches (1 inch equals 25.4 mm), then multiply by 72, as there are 72 points in one inch. This conversion is useful for typography and printing where precision is important.',
    'mm-to-in': 'To convert millimeters (mm) to inches (in), divide the millimeter value by 25.4, as there are 25.4 millimeters in an inch. This conversion provides a straightforward way to switch between metric and imperial units.',
    'mm-to-pc': 'To convert millimeters (mm) to picas (pc), first convert mm to inches and then multiply by 6, since there are 6 picas in an inch. This is useful in graphic design and typesetting where picas are commonly used.',
    'mm-to-cm': 'To convert millimeters (mm) to centimeters (cm), divide the millimeter value by 10, as 10 mm make up 1 cm. This is a direct and simple metric conversion often used in design measurements.',
    'mm-to-%': 'To convert millimeters (mm) to percent (%), convert mm to a relevant measurement such as pixels, then divide by the reference dimension (such as the width or height of a parent element) and multiply by 100 to express it as a percentage.',
    
    //%
    '%-to-px': 'To convert percent (%) to pixels (px), multiply the percent value by the reference dimension (such as the width or height of a parent element) and divide by 100. This translates the percentage into a pixel dimension based on the specific context.',
    '%-to-rem': 'To convert percent (%) to rem, first convert the percentage to pixels based on the reference dimension, then divide by the root element\'s font size in pixels. This adjusts the percentage to be relative to the base font size of the document.',
    '%-to-em': 'To convert percent (%) to em, first convert the percentage to pixels according to the reference dimension, then divide by the parent element\'s font size in pixels. This allows the percentage to be expressed relative to the local font size setting.',
    '%-to-vw': 'To convert percent (%) to viewport width (vw), simply use the percent value directly as vw, since 1vw equals 1% of the viewport’s width. This makes the conversion straightforward and direct.',
    '%-to-vh': 'To convert percent (%) to viewport height (vh), directly use the percent value as vh, because 1vh equals 1% of the viewport’s height. This provides a direct and simple conversion.',
    '%-to-pt': 'To convert percent (%) to points (pt), first convert the percentage to pixels using the reference dimension, then multiply by 0.75 (assuming a standard 96 DPI, where 1pt equals 1/72 of an inch and 1px equals 1/96 of an inch).',
    '%-to-in': 'To convert percent (%) to inches (in), first convert the percentage to pixels based on the reference dimension, then divide by the DPI of the display, typically 96 DPI, where 1 inch equals 96 pixels.',
    '%-to-pc': 'To convert percent (%) to picas (pc), first convert the percentage to points by converting to pixels and then converting those pixels to points, followed by dividing by 12 since 1 pica equals 12 points.',
    '%-to-cm': 'To convert percent (%) to centimeters (cm), first convert the percentage to pixels, then convert those pixels to inches (using the standard DPI), and multiply by 2.54 (as there are 2.54 cm in an inch).',
    '%-to-mm': 'To convert percent (%) to millimeters (mm), follow the conversion to centimeters, then multiply by 10, as 10 mm make up 1 cm. This completes the transition from percentage to metric measurement.',





  };