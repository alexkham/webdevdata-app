// // 'use client';
// // import React, { useEffect, useRef } from 'react';
// // import * as d3 from 'd3';

// // function SimpleTreeDiagram({ data }) {
// //     const ref = useRef();
// //     const width = 1200;
// //     const height = 800;
// //     const nodeWidth = 200;
// //     const nodeHeight = 80;
// //     const horizontalSpacing = 300;
// //     const verticalSpacing = 120;

// //     useEffect(() => {
// //         const svg = d3.select(ref.current);
// //         svg.selectAll('*').remove();

// //         function renderNode(node, x, y, level = 0) {
// //             const g = svg.append('g')
// //                 .attr('transform', `translate(${x},${y})`);

// //             g.append('rect')
// //                 .attr('width', nodeWidth)
// //                 .attr('height', nodeHeight)
// //                 .attr('rx', 10)
// //                 .attr('ry', 10)
// //                 .style('fill', 'white')
// //                 .style('stroke', 'black')
// //                 .style('stroke-width', 2);

// //             g.append('text')
// //                 .attr('x', nodeWidth / 2)
// //                 .attr('y', nodeHeight / 2)
// //                 .attr('text-anchor', 'middle')
// //                 .attr('dominant-baseline', 'middle')
// //                 .style('font-size', '14px')
// //                 .style('font-weight', 'bold')
// //                 .text(node.name);

// //             if (node.children) {
// //                 const childrenY = node.children.map((_, i) => 
// //                     y - (node.children.length - 1) * verticalSpacing / 2 + i * verticalSpacing
// //                 );

// //                 node.children.forEach((child, i) => {
// //                     svg.append('path')
// //                         .attr('d', `M${x + nodeWidth} ${y + nodeHeight / 2} H${x + nodeWidth + horizontalSpacing / 2} V${childrenY[i] + nodeHeight / 2} H${x + horizontalSpacing}`)
// //                         .attr('fill', 'none')
// //                         .attr('stroke', 'black')
// //                         .attr('stroke-width', 2);

// //                     renderNode(child, x + horizontalSpacing, childrenY[i], level + 1);
// //                 });
// //             }
// //         }

// //         renderNode(data, 50, height / 2);
// //     }, [data]);

// //     return <svg ref={ref} width={width} height={height}></svg>;
// // }

// // export default SimpleTreeDiagram;
// 'use client';
// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';

// function SimpleTreeDiagram({ data }) {
//     const ref = useRef();
//     const width = 1200;
//     const height = 800;
//     const nodeWidth = 200;
//     const nodeHeight = 80;
//     const horizontalSpacing = 300;
//     const verticalSpacing = 120;

//     const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

//     useEffect(() => {
//         const svg = d3.select(ref.current);
//         svg.selectAll('*').remove();

//         function renderNode(node, x, y, level = 0) {
//             const g = svg.append('g')
//                 .attr('transform', `translate(${x},${y})`);

//             g.append('rect')
//                 .attr('width', nodeWidth)
//                 .attr('height', nodeHeight)
//                 .attr('rx', 10)
//                 .attr('ry', 10)
//                 .style('fill', colorScale(level))
//                 .style('stroke', 'black')
//                 .style('stroke-width', 2);

//             g.append('text')
//                 .attr('x', nodeWidth / 2)
//                 .attr('y', nodeHeight / 2)
//                 .attr('text-anchor', 'middle')
//                 .attr('dominant-baseline', 'middle')
//                 .style('font-size', '14px')
//                 .style('font-weight', 'bold')
//                 .style('fill', 'white')
//                 .text(node.name);

//             if (node.children) {
//                 const childY1 = y - verticalSpacing / 2;
//                 const childY2 = y + verticalSpacing / 2;

//                 // Draw lines to children
//                 svg.append('path')
//                     .attr('d', `M${x + nodeWidth} ${y + nodeHeight / 2} H${x + nodeWidth + horizontalSpacing / 2} V${childY1 + nodeHeight / 2} H${x + horizontalSpacing}`)
//                     .attr('fill', 'none')
//                     .attr('stroke', 'black')
//                     .attr('stroke-width', 2);

//                 svg.append('path')
//                     .attr('d', `M${x + nodeWidth + horizontalSpacing / 2} ${y + nodeHeight / 2} V${childY2 + nodeHeight / 2} H${x + horizontalSpacing}`)
//                     .attr('fill', 'none')
//                     .attr('stroke', 'black')
//                     .attr('stroke-width', 2);

//                 // Render children
//                 renderNode(node.children[0], x + horizontalSpacing, childY1, level + 1);
//                 if (node.children[1]) {
//                     renderNode(node.children[1], x + horizontalSpacing, childY2, level + 1);
//                 }
//             }
//         }

//         renderNode(data, 50, height / 2);
//     }, [data]);

//     return <svg ref={ref} width={width} height={height}></svg>;
// }

// export default SimpleTreeDiagram;
'use client';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function SimpleTreeDiagram({ data }) {
    const ref = useRef();
    const width = 1200;
    const height = 800;
    const nodeWidth = 200;
    const nodeHeight = 80;
    const horizontalSpacing = 300;
    const verticalSpacing = 120;

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();

        function renderNode(node, x, y, level = 0) {
            const g = svg.append('g')
                .attr('transform', `translate(${x},${y})`);

            g.append('rect')
                .attr('width', nodeWidth)
                .attr('height', nodeHeight)
                .attr('rx', 10)
                .attr('ry', 10)
                .style('fill', colorScale(level))
                .style('stroke', 'black')
                .style('stroke-width', 2);

            g.append('text')
                .attr('x', nodeWidth / 2)
                .attr('y', nodeHeight / 2)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .style('font-size', '14px')
                .style('font-weight', 'bold')
                .style('fill', 'white')
                .text(node.name);

            if (node.children && node.children.length > 0) {
                const totalHeight = (node.children.length - 1) * verticalSpacing;
                const startY = y - totalHeight / 2;

                node.children.forEach((child, index) => {
                    const childY = startY + index * verticalSpacing;
                    
                    svg.append('path')
                        .attr('d', `M${x + nodeWidth} ${y + nodeHeight / 2} H${x + nodeWidth + horizontalSpacing / 2} V${childY + nodeHeight / 2} H${x + horizontalSpacing}`)
                        .attr('fill', 'none')
                        .attr('stroke', 'black')
                        .attr('stroke-width', 2);

                    renderNode(child, x + horizontalSpacing, childY, level + 1);
                });
            }
        }

        renderNode(data, 50, height / 2);
    }, [data]);

    return <svg ref={ref} width={width} height={height}></svg>;
}

export default SimpleTreeDiagram;