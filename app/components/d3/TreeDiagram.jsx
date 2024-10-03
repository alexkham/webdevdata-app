'use client';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function TreeDiagram({ data }) {
    const ref = useRef();
    const width = 1200;
    const height = 800;
    const margin = { top: 20, right: 90, bottom: 30, left: 90 };

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const tree = d3.tree()
            .size([height - margin.top - margin.bottom, width - margin.left - margin.right]);

        const root = d3.hierarchy(data);
        tree(root);

        const link = g.selectAll('.link')
            .data(root.links())
            .enter().append('path')
            .attr('class', 'link')
            .attr('d', d3.linkVertical()
                .x(d => d.x)
                .y(d => d.y))
            .attr('fill', 'none')
            .attr('stroke', '#555')
            .attr('stroke-opacity', 0.4)
            .attr('stroke-width', 1.5);

        const node = g.selectAll('.node')
            .data(root.descendants())
            .enter().append('g')
            .attr('class', d => 'node' + (d.children ? ' node--internal' : ' node--leaf'))
            .attr('transform', d => `translate(${d.x},${d.y})`);

        node.append('circle')
            .attr('r', 5)
            .style('fill', d => d.children ? '#555' : '#999');

        node.append('text')
            .attr('dy', '.35em')
            .attr('x', d => d.children ? -13 : 13)
            .style('text-anchor', d => d.children ? 'end' : 'start')
            .text(d => d.data.name);

        // Add interactivity
        node.on('mouseover', function(event, d) {
            d3.select(this).select('circle').transition()
                .duration(300)
                .attr('r', 8);
        }).on('mouseout', function(event, d) {
            d3.select(this).select('circle').transition()
                .duration(300)
                .attr('r', 5);
        });

    }, [data]);

    return <svg ref={ref} width={width} height={height}></svg>;
}

export default TreeDiagram;