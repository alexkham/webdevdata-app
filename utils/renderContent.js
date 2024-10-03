import React from 'react';
import MarkdownComponent from '@/app/components/markdown-component/MarkdownComponent';
import SQLCodeWidget from '@/app/components/sql/SQLCodeWidget';

export const renderContent = (content) => {
  return content.map((item, index) => {
    if (React.isValidElement(item)) {
      return React.cloneElement(item, { key: index });
    }
    if (typeof item === 'string') {
      return <MarkdownComponent key={index} article={item} />;
    }
    if (item && typeof item === 'object' && 'type' in item) {
      if (item.type === 'sql' && item.data) {
        return <SQLCodeWidget key={index} data={item.data} />;
      }
      if (item.type === 'markdown') {
        return <MarkdownComponent key={index} article={item.content} />;
      }
    }
    return null;
  });
};