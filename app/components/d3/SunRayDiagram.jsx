// // // // // 'use client';
// // // // // import React, { useEffect, useRef } from 'react';
// // // // // import * as d3 from 'd3';

// // // // // function SunRayDiagramWithDetails({ data }) {
// // // // //     const ref = useRef();
// // // // //     const width = 1200;
// // // // //     const height = 1000;
// // // // //     const baseRadius = Math.min(width, height) / 2 - 100; // Base radius for placing child nodes

// // // // //     useEffect(() => {
// // // // //         const svg = d3.select(ref.current);
// // // // //         svg.selectAll('*').remove(); // Clear previous SVG content

// // // // //         const centerX = width / 2;
// // // // //         const centerY = height / 2;
// // // // //         const rootRadius = data.root.value; // Assuming 'value' represents the radius of the root node

// // // // //         // Create central circle (root)
// // // // //         svg.append('circle')
// // // // //            .attr('cx', centerX)
// // // // //            .attr('cy', centerY)
// // // // //            .attr('r', rootRadius)
// // // // //            .style('fill', 'lightblue')
// // // // //            .style('stroke', 'black')
// // // // //            .style('stroke-width', 2);

// // // // //         // Create text for root node
// // // // //         svg.append('text')
// // // // //            .attr('x', centerX)
// // // // //            .attr('y', centerY)
// // // // //            .attr('text-anchor', 'middle')
// // // // //            .style('font-weight', 'bold')
// // // // //            .text(data.root.name);

// // // // //         const angleIncrement = (2 * Math.PI) / data.children.length; // Uniform angle increment

// // // // //         data.children.forEach((item, index) => {
// // // // //             const angle = angleIncrement * index; // Calculate angle for each child
// // // // //             const x = Math.cos(angle) * baseRadius + centerX;
// // // // //             const y = Math.sin(angle) * baseRadius + centerY;

// // // // //             // Calculate the line's start point on the border of the root node
// // // // //             const lineStartX = Math.cos(angle) * rootRadius + centerX;
// // // // //             const lineStartY = Math.sin(angle) * rootRadius + centerY;

// // // // //             // Draw line from border of root to each child
// // // // //             svg.append('line')
// // // // //                .attr('x1', lineStartX)
// // // // //                .attr('y1', lineStartY)
// // // // //                .attr('x2', x)
// // // // //                .attr('y2', y)
// // // // //                .style('stroke', 'grey')
// // // // //                .style('stroke-width', 1);

// // // // //             const rectWidth = 197;  // Adjusted width
// // // // //             const rectHeight = 50 + 15 * item.details.length; // Adjusted height

// // // // //             // const childGroup = svg.append('g')
// // // // //             //     .on('click', () => window.open(item.link, '_blank'));  // Add hyperlink functionality
// // // // //             const childLink = svg.append('a')
// // // // //             .attr('xlink:href', item.link);  // URL for each child node


// // // // //             // Append rectangle for each child with rounded corners
// // // // //             childLink.append('rect')
// // // // //                .attr('x', x - rectWidth / 2)
// // // // //                .attr('y', y - rectHeight / 2)
// // // // //                .attr('width', rectWidth)
// // // // //                .attr('height', rectHeight)
// // // // //                .attr('rx', 10)
// // // // //                .attr('ry', 10)
// // // // //                .style('fill', 'lightgray')
// // // // //                .style('stroke', 'black')
// // // // //                .style('stroke-width', 1)
// // // // //                .style('cursor', d => d?.link ? 'pointer' : 'default')  // Conditional cursor style
// // // // //                 .on('click', d => {
// // // // //                     if (d?.link) window.open(d?.link, '_blank');  // Add click event only if link exists
// // // // //                      });

// // // // //             // Append text for each child
// // // // //             childLink.append('text')
// // // // //                .attr('x', x)
// // // // //                .attr('y', y - (rectHeight / 2 - 20))
// // // // //                .attr('text-anchor', 'middle')
// // // // //                .style('font-weight', 'bold')
// // // // //                .text(item.name);

// // // // //             // Append details as bullet points
// // // // //             item.details.forEach((detail, di) => {
// // // // //                 childLink.append('text')
// // // // //                    .attr('x', x)
// // // // //                    .attr('y', y + 15 * di - (rectHeight / 2 - 35))
// // // // //                    .attr('text-anchor', 'middle')
// // // // //                    .style('font-size', '12px')
// // // // //                    .text(`• ${detail}`);
// // // // //             });
// // // // //         });
// // // // //     }, [data]); // Redraw when data changes

// // // // //     return <svg ref={ref} width={width} height={height}></svg>;
// // // // // }

// // // // // export default SunRayDiagramWithDetails;
// // // // 'use client';
// // // // import React, { useEffect, useRef } from 'react';
// // // // import * as d3 from 'd3';

// // // // function SunRayDiagramWithDetails({ data }) {
// // // //     const ref = useRef();
// // // //     const width = 1200; // Reduced from 1200
// // // //     const height = 1000; // Reduced from 1000
// // // //     const baseRadius = Math.min(width, height) / 4; // Reduced from /2 to bring nodes closer

// // // //     useEffect(() => {
// // // //         const svg = d3.select(ref.current);
// // // //         svg.selectAll('*').remove();

// // // //         const centerX = width / 2;
// // // //         const centerY = height / 2;
// // // //         const rootRadius = data.root.value * 0.8; // Slightly reduced root node size

// // // //         // Create central circle (root)
// // // //         svg.append('circle')
// // // //            .attr('cx', centerX)
// // // //            .attr('cy', centerY)
// // // //            .attr('r', rootRadius)
// // // //            .style('fill', 'lightblue')
// // // //            .style('stroke', 'black')
// // // //            .style('stroke-width', 2);

// // // //         // Create text for root node
// // // //         svg.append('text')
// // // //            .attr('x', centerX)
// // // //            .attr('y', centerY)
// // // //            .attr('text-anchor', 'middle')
// // // //            .style('font-weight', 'bold')
// // // //            .text(data.root.name);

// // // //         const angleIncrement = (2 * Math.PI) / data.children.length;

// // // //         data.children.forEach((item, index) => {
// // // //             const angle = angleIncrement * index;
// // // //             const x = Math.cos(angle) * baseRadius + centerX;
// // // //             const y = Math.sin(angle) * baseRadius + centerY;

// // // //             const lineStartX = Math.cos(angle) * rootRadius + centerX;
// // // //             const lineStartY = Math.sin(angle) * rootRadius + centerY;

// // // //             svg.append('line')
// // // //                .attr('x1', lineStartX)
// // // //                .attr('y1', lineStartY)
// // // //                .attr('x2', x)
// // // //                .attr('y2', y)
// // // //                .style('stroke', 'grey')
// // // //                .style('stroke-width', 1);

// // // //             const rectWidth = 220;  // Increased width
// // // //             const rectHeight = 60 + 15 * item.details.length; // Slightly increased height

// // // //             const childLink = svg.append('a')
// // // //                 .attr('xlink:href', item.link);

// // // //             childLink.append('rect')
// // // //                .attr('x', x - rectWidth / 2)
// // // //                .attr('y', y - rectHeight / 2)
// // // //                .attr('width', rectWidth)
// // // //                .attr('height', rectHeight)
// // // //                .attr('rx', 10)
// // // //                .attr('ry', 10)
// // // //                .style('fill', 'lightgray')
// // // //                .style('stroke', 'black')
// // // //                .style('stroke-width', 1)
// // // //                .style('cursor', d => d?.link ? 'pointer' : 'default')
// // // //                .on('click', d => {
// // // //                    if (d?.link) window.open(d?.link, '_blank');
// // // //                });

// // // //             childLink.append('text')
// // // //                .attr('x', x)
// // // //                .attr('y', y - (rectHeight / 2 - 20))
// // // //                .attr('text-anchor', 'middle')
// // // //                .style('font-weight', 'bold')
// // // //                .text(item.name);

// // // //             item.details.forEach((detail, di) => {
// // // //                 childLink.append('text')
// // // //                    .attr('x', x)
// // // //                    .attr('y', y + 15 * di - (rectHeight / 2 - 40))
// // // //                    .attr('text-anchor', 'middle')
// // // //                    .style('font-size', '12px')
// // // //                    .text(`• ${detail}`);
// // // //             });
// // // //         });
// // // //     }, [data]);

// // // //     return <svg ref={ref} width={width} height={height}></svg>;
// // // // }

// // // // export default SunRayDiagramWithDetails;
// // // // 'use client';
// // // // import React, { useEffect, useRef } from 'react';
// // // // import * as d3 from 'd3';

// // // // function SunRayDiagramWithDetails({ data }) {
// // // //     const ref = useRef();
// // // //     const width = 1200;
// // // //     const height = 1000;
// // // //     const baseRadius = Math.min(width, height) / 5;

// // // //     useEffect(() => {
// // // //         const svg = d3.select(ref.current);
// // // //         svg.selectAll('*').remove();

// // // //         const centerX = width / 2;
// // // //         const centerY = height / 2;
// // // //         const rootRadius = data.root.value * 0.8;

// // // //         // Calculate aspect ratio
// // // //         const aspectRatio = width / height;

// // // //         // Create central circle (root)
// // // //         svg.append('circle')
// // // //            .attr('cx', centerX)
// // // //            .attr('cy', centerY)
// // // //            .attr('r', rootRadius)
// // // //            .style('fill', 'lightblue')
// // // //            .style('stroke', 'black')
// // // //            .style('stroke-width', 2);

// // // //         // Create text for root node
// // // //         svg.append('text')
// // // //            .attr('x', centerX)
// // // //            .attr('y', centerY)
// // // //            .attr('text-anchor', 'middle')
// // // //            .style('font-weight', 'bold')
// // // //            .text(data.root.name);

// // // //         const angleIncrement = (2 * Math.PI) / data.children.length;

// // // //         data.children.forEach((item, index) => {
// // // //             const angle = angleIncrement * index;
// // // //             // Adjust x and y calculations to account for aspect ratio
// // // //             const x = Math.cos(angle) * baseRadius * aspectRatio + centerX;
// // // //             const y = Math.sin(angle) * baseRadius + centerY;

// // // //             const lineStartX = Math.cos(angle) * rootRadius * aspectRatio + centerX;
// // // //             const lineStartY = Math.sin(angle) * rootRadius + centerY;

// // // //             svg.append('line')
// // // //                .attr('x1', lineStartX)
// // // //                .attr('y1', lineStartY)
// // // //                .attr('x2', x)
// // // //                .attr('y2', y)
// // // //                .style('stroke', 'grey')
// // // //                .style('stroke-width', 1);

// // // //             const rectWidth = 220;
// // // //             const rectHeight = 50 + 15 * item.details.length;

// // // //             const childLink = svg.append('a')
// // // //                 .attr('xlink:href', item.link);

// // // //             childLink.append('rect')
// // // //                .attr('x', x - rectWidth / 2)
// // // //                .attr('y', y - rectHeight / 2)
// // // //                .attr('width', rectWidth)
// // // //                .attr('height', rectHeight)
// // // //                .attr('rx', 10)
// // // //                .attr('ry', 10)
// // // //                .style('fill', 'lightgray')
// // // //                .style('stroke', 'black')
// // // //                .style('stroke-width', 1)
// // // //                .style('cursor', d => d?.link ? 'pointer' : 'default')
// // // //                .on('click', d => {
// // // //                    if (d?.link) window.open(d?.link, '_blank');
// // // //                });

// // // //             childLink.append('text')
// // // //                .attr('x', x)
// // // //                .attr('y', y - (rectHeight / 2 - 20))
// // // //                .attr('text-anchor', 'middle')
// // // //                .style('font-weight', 'bold')
// // // //                .text(item.name);

// // // //             item.details.forEach((detail, di) => {
// // // //                 childLink.append('text')
// // // //                    .attr('x', x)
// // // //                    .attr('y', y + 15 * di - (rectHeight / 2 - 40))
// // // //                    .attr('text-anchor', 'middle')
// // // //                    .style('font-size', '12px')
// // // //                    .text(`• ${detail}`);
// // // //             });
// // // //         });
// // // //     }, [data]);

// // // //     return <svg ref={ref} width={width} height={height}></svg>;
// // // // }

// // // // export default SunRayDiagramWithDetails;
// // // 'use client';
// // // import React, { useEffect, useRef } from 'react';
// // // import * as d3 from 'd3';

// // // function SunRayDiagramWithDetails({ data, angleJitter = 0.2 }) {
// // //     const ref = useRef();
// // //     const width = 1200;
// // //     const height = 1000;
// // //     const baseRadius = Math.min(width, height) / 4;

// // //     useEffect(() => {
// // //         const svg = d3.select(ref.current);
// // //         svg.selectAll('*').remove();

// // //         const centerX = width / 2;
// // //         const centerY = height / 2;
// // //         const rootRadius = data.root.value * 0.8;

// // //         // Calculate aspect ratio
// // //         const aspectRatio = width / height;

// // //         // Create central circle (root)
// // //         svg.append('circle')
// // //            .attr('cx', centerX)
// // //            .attr('cy', centerY)
// // //            .attr('r', rootRadius)
// // //            .style('fill', 'lightblue')
// // //            .style('stroke', 'black')
// // //            .style('stroke-width', 2);

// // //         // Create text for root node
// // //         svg.append('text')
// // //            .attr('x', centerX)
// // //            .attr('y', centerY)
// // //            .attr('text-anchor', 'middle')
// // //            .style('font-weight', 'bold')
// // //            .text(data.root.name);

// // //         const baseAngleIncrement = (2 * Math.PI) / data.children.length;

// // //         // Generate jittered angles
// // //         const jitteredAngles = data.children.map((_, index) => {
// // //             const baseAngle = baseAngleIncrement * index;
// // //             const jitter = (Math.random() - 0.5) * 2 * angleJitter * baseAngleIncrement;
// // //             return baseAngle + jitter;
// // //         });

// // //         // Sort angles to prevent overlapping
// // //         jitteredAngles.sort((a, b) => a - b);

// // //         data.children.forEach((item, index) => {
// // //             const angle = jitteredAngles[index];
// // //             // Adjust x and y calculations to account for aspect ratio
// // //             const x = Math.cos(angle) * baseRadius * aspectRatio + centerX;
// // //             const y = Math.sin(angle) * baseRadius + centerY;

// // //             const lineStartX = Math.cos(angle) * rootRadius * aspectRatio + centerX;
// // //             const lineStartY = Math.sin(angle) * rootRadius + centerY;

// // //             svg.append('line')
// // //                .attr('x1', lineStartX)
// // //                .attr('y1', lineStartY)
// // //                .attr('x2', x)
// // //                .attr('y2', y)
// // //                .style('stroke', 'grey')
// // //                .style('stroke-width', 1);

// // //             const rectWidth = 220;
// // //             const rectHeight = 70 + 15 * item.details.length;

// // //             const childLink = svg.append('a')
// // //                 .attr('xlink:href', item.link);

// // //             childLink.append('rect')
// // //                .attr('x', x - rectWidth / 2)
// // //                .attr('y', y - rectHeight / 2)
// // //                .attr('width', rectWidth)
// // //                .attr('height', rectHeight)
// // //                .attr('rx', 10)
// // //                .attr('ry', 10)
// // //                .style('fill', 'lightgray')
// // //                .style('stroke', 'black')
// // //                .style('stroke-width', 1)
// // //                .style('cursor', d => d?.link ? 'pointer' : 'default')
// // //                .on('click', d => {
// // //                    if (d?.link) window.open(d?.link, '_blank');
// // //                });

// // //             childLink.append('text')
// // //                .attr('x', x)
// // //                .attr('y', y - (rectHeight / 2 - 20))
// // //                .attr('text-anchor', 'middle')
// // //                .style('font-weight', 'bold')
// // //                .text(item.name);

// // //             item.details.forEach((detail, di) => {
// // //                 childLink.append('text')
// // //                    .attr('x', x)
// // //                    .attr('y', y + 15 * di - (rectHeight / 2 - 40))
// // //                    .attr('text-anchor', 'middle')
// // //                    .style('font-size', '12px')
// // //                    .text(`• ${detail}`);
// // //             });
// // //         });
// // //     }, [data, angleJitter]);

// // //     return <svg ref={ref} width={width} height={height}></svg>;
// // // }

// // // export default SunRayDiagramWithDetails;
// // // 'use client';
// // // import React, { useEffect, useRef } from 'react';
// // // import * as d3 from 'd3';

// // // function SunRayDiagramWithDetails({ data, angleJitter = 0.2 }) {
// // //     const ref = useRef();
// // //     const width = 1200;
// // //     const height = 1000;
// // //     const baseRadius = Math.min(width, height) / 4.4;

// // //     useEffect(() => {
// // //         const svg = d3.select(ref.current);
// // //         svg.selectAll('*').remove();

// // //         const centerX = width / 2;
// // //         const centerY = height / 2;
// // //         const rootRadius = data.root.value * 0.8;

// // //         // Calculate aspect ratio
// // //         const aspectRatio = width / height;

// // //         // Create central circle (root)
// // //         svg.append('circle')
// // //            .attr('cx', centerX)
// // //            .attr('cy', centerY)
// // //            .attr('r', rootRadius)
// // //            .style('fill', 'lightblue')
// // //            .style('stroke', 'gray')
// // //            .style('stroke-width', 0.5);

// // //         // Create text for root node
// // //         svg.append('text')
// // //            .attr('x', centerX)
// // //            .attr('y', centerY)
// // //            .attr('text-anchor', 'middle')
// // //            .style('font-weight', 'bold')
// // //            .text(data.root.name);

// // //         const baseAngleIncrement = (2 * Math.PI) / data.children.length;

// // //         // Generate jittered angles
// // //         const jitteredAngles = data.children.map((_, index) => {
// // //             const baseAngle = baseAngleIncrement * index;
// // //             const jitter = (Math.random() - 0.5) * 2 * angleJitter * baseAngleIncrement;
// // //             return baseAngle + jitter;
// // //         });

// // //         // Sort angles to prevent overlapping
// // //         jitteredAngles.sort((a, b) => a - b);

// // //         data.children.forEach((item, index) => {
// // //             const angle = jitteredAngles[index];
// // //             // Adjust only x calculation to account for aspect ratio
// // //             const x = Math.cos(angle) * baseRadius * aspectRatio + centerX;
// // //             const y = Math.sin(angle) * baseRadius + centerY;

// // //             // Calculate line start point without aspect ratio adjustment
// // //             const lineStartX = Math.cos(angle) * rootRadius + centerX;
// // //             const lineStartY = Math.sin(angle) * rootRadius + centerY;

// // //             svg.append('line')
// // //                .attr('x1', lineStartX)
// // //                .attr('y1', lineStartY)
// // //                .attr('x2', x)
// // //                .attr('y2', y)
// // //                .style('stroke', 'grey')
// // //                .style('stroke-width', 0.5);

// // //             const rectWidth = 180;
// // //             const rectHeight = 40 + 15 * item.details.length;

// // //             const childLink = svg.append('a')
// // //                 .attr('xlink:href', item.link);

// // //             childLink.append('rect')
// // //                .attr('x', x - rectWidth / 2)
// // //                .attr('y', y - rectHeight / 2)
// // //                .attr('width', rectWidth)
// // //                .attr('height', rectHeight)
// // //                .attr('rx', 10)
// // //                .attr('ry', 10)
// // //                .style('fill', 'lightgray')
// // //                .style('stroke', 'gray')
// // //                .style('stroke-width', 0.5)
// // //                .style('cursor', item.link ? 'pointer' : 'default')
// // //                .on('click', () => {
// // //                    if (item.link) window.open(item.link, '_blank');
// // //                });

// // //             childLink.append('text')
// // //                .attr('x', x)
// // //                .attr('y', y - (rectHeight / 2 - 20))
// // //                .attr('text-anchor', 'middle')
// // //                .style('font-weight', 'bold')
// // //                .text(item.name);

// // //             item.details.forEach((detail, di) => {
// // //                 childLink.append('text')
// // //                    .attr('x', x)
// // //                    .attr('y', y + 15 * di - (rectHeight / 2 - 40))
// // //                    .attr('text-anchor', 'middle')
// // //                    .style('font-size', '12px')
// // //                    .text(`• ${detail}`);
// // //             });
// // //         });
// // //     }, [data, angleJitter]);

// // //     return <svg ref={ref} width={width} height={height}></svg>;
// // // }

// // // export default SunRayDiagramWithDetails;
// // 'use client';
// // import React, { useEffect, useRef } from 'react';
// // import * as d3 from 'd3';

// // function SunRayDiagramWithDetails({ data, angleJitter = 0.2 }) {
// //     const containerRef = useRef();
// //     const svgRef = useRef();
// //     const width = 1200;
// //     const height = 1000;
// //     const baseRadius = Math.min(width, height) / 4.4;

// //     useEffect(() => {
// //         const svg = d3.select(svgRef.current);
// //         svg.selectAll('*').remove();

// //         const g = svg.append('g');

// //         const centerX = width / 2;
// //         const centerY = height / 2;
// //         const rootRadius = data.root.value * 0.8;

// //         // Calculate aspect ratio
// //         const aspectRatio = width / height;

// //         // Create central circle (root)
// //         g.append('circle')
// //             .attr('cx', centerX)
// //             .attr('cy', centerY)
// //             .attr('r', rootRadius)
// //             .style('fill', 'lightblue')
// //             .style('stroke', 'gray')
// //             .style('stroke-width', 0.5);

// //         // Create text for root node
// //         g.append('text')
// //             .attr('x', centerX)
// //             .attr('y', centerY)
// //             .attr('text-anchor', 'middle')
// //             .style('font-weight', 'bold')
// //             .text(data.root.name);

// //         const baseAngleIncrement = (2 * Math.PI) / data.children.length;

// //         // Generate jittered angles
// //         const jitteredAngles = data.children.map((_, index) => {
// //             const baseAngle = baseAngleIncrement * index;
// //             const jitter = (Math.random() - 0.5) * 2 * angleJitter * baseAngleIncrement;
// //             return baseAngle + jitter;
// //         });

// //         // Sort angles to prevent overlapping
// //         jitteredAngles.sort((a, b) => a - b);

// //         data.children.forEach((item, index) => {
// //             const angle = jitteredAngles[index];
// //             // Adjust only x calculation to account for aspect ratio
// //             const x = Math.cos(angle) * baseRadius * aspectRatio + centerX;
// //             const y = Math.sin(angle) * baseRadius + centerY;

// //             // Calculate line start point without aspect ratio adjustment
// //             const lineStartX = Math.cos(angle) * rootRadius + centerX;
// //             const lineStartY = Math.sin(angle) * rootRadius + centerY;

// //             g.append('line')
// //                 .attr('x1', lineStartX)
// //                 .attr('y1', lineStartY)
// //                 .attr('x2', x)
// //                 .attr('y2', y)
// //                 .style('stroke', 'grey')
// //                 .style('stroke-width', 0.5);

// //             const rectWidth = 180;
// //             const rectHeight = 40 + 15 * item.details.length;

// //             const childLink = g.append('a')
// //                 .attr('xlink:href', item.link);

// //             childLink.append('rect')
// //                 .attr('x', x - rectWidth / 2)
// //                 .attr('y', y - rectHeight / 2)
// //                 .attr('width', rectWidth)
// //                 .attr('height', rectHeight)
// //                 .attr('rx', 10)
// //                 .attr('ry', 10)
// //                 .style('fill', 'lightgray')
// //                 .style('stroke', 'gray')
// //                 .style('stroke-width', 0.5)
// //                 .style('cursor', item.link ? 'pointer' : 'default')
// //                 .on('click', () => {
// //                     if (item.link) window.open(item.link, '_blank');
// //                 });

// //             childLink.append('text')
// //                 .attr('x', x)
// //                 .attr('y', y - (rectHeight / 2 - 20))
// //                 .attr('text-anchor', 'middle')
// //                 .style('font-weight', 'bold')
// //                 .text(item.name);

// //             item.details.forEach((detail, di) => {
// //                 childLink.append('text')
// //                     .attr('x', x)
// //                     .attr('y', y + 15 * di - (rectHeight / 2 - 40))
// //                     .attr('text-anchor', 'middle')
// //                     .style('font-size', '12px')
// //                     .text(`• ${detail}`);
// //             });
// //         });

// //         // Add zoom behavior
// //         const zoom = d3.zoom()
// //             .scaleExtent([0.1, 4])
// //             .on('zoom', (event) => {
// //                 g.attr('transform', event.transform);
// //             });

// //         svg.call(zoom);

// //         // Initial zoom to fit the entire diagram
// //         const bounds = g.node().getBBox();
// //         const fullWidth = bounds.width;
// //         const fullHeight = bounds.height;
// //         const scale = Math.min(width / fullWidth, height / fullHeight) * 0.9;
// //         const translateX = (width - fullWidth * scale) / 2 - bounds.x * scale;
// //         const translateY = (height - fullHeight * scale) / 2 - bounds.y * scale;

// //         svg.call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(scale));

// //     }, [data, angleJitter]);

// //     return (
// //         <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
// //             <svg ref={svgRef} width={width} height={height}></svg>
// //         </div>
// //     );
// // }

// // export default SunRayDiagramWithDetails;
// 'use client';
// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';

// function SunRayDiagramWithDetails
// ({ data, angleJitter = 0.2, 
//     zoomLevel = 1 ,
//     divider=4.4,
//     nodeWidth=180}) {


//     const containerRef = useRef();
//     const svgRef = useRef();
//     const width = 1200;
//     const height = 1000;
//     const baseRadius = Math.min(width, height) / divider;

//     useEffect(() => {
//         const svg = d3.select(svgRef.current);
//         svg.selectAll('*').remove();

//         const g = svg.append('g');

//         const centerX = width / 2;
//         const centerY = height / 2;
//         const rootRadius = data.root.value * 0.8;

//         // Calculate aspect ratio
//         const aspectRatio = width / height;

//         // Create central circle (root)
//         g.append('circle')
//             .attr('cx', centerX)
//             .attr('cy', centerY)
//             .attr('r', rootRadius)
//             .style('fill', 'lightblue')
//             .style('stroke', 'gray')
//             .style('stroke-width', 0.5);

//         // Create text for root node
//         g.append('text')
//             .attr('x', centerX)
//             .attr('y', centerY)
//             .attr('text-anchor', 'middle')
//             .style('font-weight', 'bold')
//             .text(data.root.name);

//         const baseAngleIncrement = (2 * Math.PI) / data.children.length;

//         // Generate jittered angles
//         const jitteredAngles = data.children.map((_, index) => {
//             const baseAngle = baseAngleIncrement * index;
//             const jitter = (Math.random() - 0.5) * 2 * angleJitter * baseAngleIncrement;
//             return baseAngle + jitter;
//         });

//         // Sort angles to prevent overlapping
//         jitteredAngles.sort((a, b) => a - b);

//         data.children.forEach((item, index) => {
//             const angle = jitteredAngles[index];
//             // Adjust only x calculation to account for aspect ratio
//             const x = Math.cos(angle) * baseRadius * aspectRatio + centerX;
//             const y = Math.sin(angle) * baseRadius + centerY;

//             // Calculate line start point without aspect ratio adjustment
//             const lineStartX = Math.cos(angle) * rootRadius + centerX;
//             const lineStartY = Math.sin(angle) * rootRadius + centerY;

//             g.append('line')
//                 .attr('x1', lineStartX)
//                 .attr('y1', lineStartY)
//                 .attr('x2', x)
//                 .attr('y2', y)
//                 .style('stroke', 'grey')
//                 .style('stroke-width', 0.5);

//             const rectWidth = nodeWidth;
//             const rectHeight = 40 + 15 * item.details.length;

//             const childLink = g.append('a')
//                 .attr('xlink:href', item.link);

//             childLink.append('rect')
//                 .attr('x', x - rectWidth / 2)
//                 .attr('y', y - rectHeight / 2)
//                 .attr('width', rectWidth)
//                 .attr('height', rectHeight)
//                 .attr('rx', 10)
//                 .attr('ry', 10)
//                 .style('fill', 'lightgray')
//                 .style('stroke', 'gray')
//                 .style('stroke-width', 0.5)
//                 .style('cursor', item.link ? 'pointer' : 'default')
//                 .on('click', () => {
//                     if (item.link) window.open(item.link, '_blank');
//                 });

//             childLink.append('text')
//                 .attr('x', x)
//                 .attr('y', y - (rectHeight / 2 - 20))
//                 .attr('text-anchor', 'middle')
//                 .style('font-weight', 'bold')
//                 .text(item.name);

//             item.details.forEach((detail, di) => {
//                 childLink.append('text')
//                     .attr('x', x)
//                     .attr('y', y + 15 * di - (rectHeight / 2 - 40))
//                     .attr('text-anchor', 'middle')
//                     .style('font-size', '12px')
//                     .text(`• ${detail}`);
//             });
//         });

//         // Apply fixed zoom
//         const bounds = g.node().getBBox();
//         const fullWidth = bounds.width;
//         const fullHeight = bounds.height;
//         const scale = Math.min(width / fullWidth, height / fullHeight) * 0.9 * zoomLevel;
//         const translateX = (width - fullWidth * scale) / 2 - bounds.x * scale;
//         const translateY = (height - fullHeight * scale) / 2 - bounds.y * scale;

//         g.attr('transform', `translate(${translateX}, ${translateY}) scale(${scale})`);

//     }, [data, angleJitter, zoomLevel]);

//     return (
//         <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
//             <svg ref={svgRef} width={width} height={height}></svg>
//         </div>
//     );
// }

// export default SunRayDiagramWithDetails;
'use client';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function SunRayDiagramWithDetails({ data, angleJitter = 0.2, zoomLevel = 1, divider = 4.4, nodeWidth = 180 }) {
    const containerRef = useRef();
    const svgRef = useRef();
    const width = 1200;
    const height = 800;
    const baseRadius = Math.min(width, height) / divider;

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const g = svg.append('g');

        const centerX = width / 2;
        const centerY = height / 2;
        const rootRadius = data.root.value * 0.8;

        // Calculate aspect ratio
        const aspectRatio = width / height;

        // Create central circle (root)
        g.append('circle')
            .attr('cx', centerX)
            .attr('cy', centerY)
            .attr('r', rootRadius)
            .style('fill', 'lightblue')
            .style('stroke', 'gray')
            .style('stroke-width', 0.5);

        // Create text for root node
        g.append('text')
            .attr('x', centerX)
            .attr('y', centerY)
            .attr('text-anchor', 'middle')
            .style('font-weight', 'bold')
            .style('font-family', 'Arial, sans-serif') // Custom font family
            .style('font-size', '20px') // Custom font size
            .text(data.root.name);

        const baseAngleIncrement = (2 * Math.PI) / data.children.length;

        // Generate jittered angles
        const jitteredAngles = data.children.map((_, index) => {
            const baseAngle = baseAngleIncrement * index;
            const jitter = (Math.random() - 0.5) * 2 * angleJitter * baseAngleIncrement;
            return baseAngle + jitter;
        });

        // Sort angles to prevent overlapping
        jitteredAngles.sort((a, b) => a - b);

        data.children.forEach((item, index) => {
            const angle = jitteredAngles[index];
            // Adjust only x calculation to account for aspect ratio
            const x = Math.cos(angle) * baseRadius * aspectRatio + centerX;
            const y = Math.sin(angle) * baseRadius + centerY;

            // Calculate line start point without aspect ratio adjustment
            const lineStartX = Math.cos(angle) * rootRadius + centerX;
            const lineStartY = Math.sin(angle) * rootRadius + centerY;

            g.append('line')
                .attr('x1', lineStartX)
                .attr('y1', lineStartY)
                .attr('x2', x)
                .attr('y2', y)
                .style('stroke', 'grey')
                .style('stroke-width', 0.5);

            const rectWidth = nodeWidth;
            const rectHeight = 40 + 15 * item.details.length;

            const childLink = g.append('a')
                .attr('xlink:href', item.link);

            childLink.append('rect')
                .attr('x', x - rectWidth / 2)
                .attr('y', y - rectHeight / 2)
                .attr('width', rectWidth)
                .attr('height', rectHeight)
                .attr('rx', 10)
                .attr('ry', 10)
                .style('fill', 'lightgray')
                .style('stroke', 'gray')
                .style('stroke-width', 0.5)
                .style('cursor', item.link ? 'pointer' : 'default')
                .on('click', () => {
                    if (item.link) window.open(item.link, '_blank');
                });

            childLink.append('text')
                .attr('x', x)
                .attr('y', y - (rectHeight / 2 - 20))
                .attr('text-anchor', 'middle')
                .style('font-weight', 'bold')
                .style('font-family', 'Arial, sans-serif') // Custom font family
                .style('font-size', '16px')
                .text(item.name);

            item.details.forEach((detail, di) => {
                childLink.append('text')
                    .attr('x', x)
                    .attr('y', y + 15 * di - (rectHeight / 2 - 40))
                    .attr('text-anchor', 'middle')
                    .style('font-size', '16px')
                    .text(`• ${detail}`);
            });
        });

        // Apply fixed zoom and position at the top
        const bounds = g.node().getBBox();
        const fullWidth = bounds.width;
        const fullHeight = bounds.height;
        const scale = Math.min(width / fullWidth, height / fullHeight) * 0.9 * zoomLevel;
        const translateX = (width - fullWidth * scale) / 2 - bounds.x * scale;
        const translateY = 20 - bounds.y * scale; // Position at the top with 20px margin

        g.attr('transform', `translate(${translateX}, ${translateY}) scale(${scale})`);

    }, [data, angleJitter, zoomLevel, divider, nodeWidth]);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <svg ref={svgRef} width={width} height={height}></svg>
        </div>
    );
}

export default SunRayDiagramWithDetails;