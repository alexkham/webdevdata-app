import React, { useState } from 'react';

const ExplorerVariants = () => {
  const [activeVariant, setActiveVariant] = useState('tabs');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedOperation, setSelectedOperation] = useState(null);

  const categories = [
    { id: 'arrays', name: 'Arrays' },
    { id: 'strings', name: 'Strings' },
    { id: 'objects', name: 'Objects' },
  ];

  const subCategories = {
    arrays: [
      { id: 'manipulation', name: 'Array Manipulation' },
      { id: 'search', name: 'Search Operations' },
    ],
    strings: [
      { id: 'transform', name: 'String Transformations' },
      { id: 'search', name: 'Search & Replace' },
    ],
    objects: [
      { id: 'properties', name: 'Property Operations' },
      { id: 'methods', name: 'Object Methods' },
    ],
  };

  const operations = {
    arrays: {
      manipulation: [
        {
          id: 'push',
          name: 'Array Push',
          description: 'Add elements to the end of an array',
          syntax: 'array.push(element1[, ...[, elementN]])',
          example: `const fruits = ['apple', 'banana'];
fruits.push('orange');
console.log(fruits); // ['apple', 'banana', 'orange']`,
          notes: ['Modifies the original array', 'Returns the new length'],
        },
        {
          id: 'pop',
          name: 'Array Pop',
          description: 'Remove the last element from an array',
          syntax: 'array.pop()',
          example: `const fruits = ['apple', 'banana', 'orange'];
const last = fruits.pop();
console.log(fruits); // ['apple', 'banana']`,
          notes: ['Modifies the original array', 'Returns removed element'],
        },
      ],
    },
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif',
    },
    variantSelector: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
    },
    variantButton: {
      padding: '10px 20px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      background: 'white',
      cursor: 'pointer',
    },
    activeVariant: {
      background: '#e0e7ff',
      borderColor: '#818cf8',
      color: '#4338ca',
    },
    // Tabs variant styles
    tabsContainer: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    tabs: {
      display: 'flex',
      background: '#f8f9fa',
      borderBottom: '1px solid #ddd',
    },
    tab: {
      padding: '15px 25px',
      cursor: 'pointer',
      borderRight: '1px solid #ddd',
    },
    activeTab: {
      background: 'white',
      borderBottom: '2px solid #4338ca',
      marginBottom: '-1px',
    },
    tabContent: {
      padding: '20px',
    },
    // Accordion variant styles
    accordion: {
      border: '1px solid #ddd',
      borderRadius: '8px',
    },
    accordionItem: {
      borderBottom: '1px solid #ddd',
    },
    accordionHeader: {
      padding: '15px 20px',
      background: '#f8f9fa',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
    },
    accordionContent: {
      padding: '15px 20px',
    },
    // Sidebar variant styles
    sidebarLayout: {
      display: 'grid',
      gridTemplateColumns: '250px 1fr',
      gap: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      minHeight: '600px',
    },
    sidebar: {
      borderRight: '1px solid #ddd',
      padding: '20px',
      background: '#f8f9fa',
    },
    sidebarItem: {
      padding: '10px',
      cursor: 'pointer',
      marginBottom: '5px',
      borderRadius: '4px',
    },
    activeSidebarItem: {
      background: '#e0e7ff',
      color: '#4338ca',
    },
    mainContent: {
      padding: '20px',
    },
    // Common styles
    operationDetail: {
      padding: '20px',
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '4px',
    },
    codeBlock: {
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '4px',
      fontFamily: 'monospace',
      whiteSpace: 'pre',
      overflowX: 'auto',
    },
  };

  const renderOperationDetail = (operation) => (
    <div style={styles.operationDetail}>
      <h2>{operation.name}</h2>
      <p>{operation.description}</p>
      <h3>Syntax</h3>
      <div style={styles.codeBlock}>{operation.syntax}</div>
      <h3>Example</h3>
      <div style={styles.codeBlock}>{operation.example}</div>
      <h3>Notes</h3>
      <ul>
        {operation.notes.map((note, i) => (
          <li key={i}>{note}</li>
        ))}
      </ul>
    </div>
  );

  const renderTabsVariant = () => (
    <div style={styles.tabsContainer}>
      <div style={styles.tabs}>
        {categories.map((category) => (
          <div
            key={category.id}
            style={{
              ...styles.tab,
              ...(selectedCategory === category.id ? styles.activeTab : {}),
            }}
            onClick={() => {
              setSelectedCategory(category.id);
              setSelectedSubCategory(null);
              setSelectedOperation(null);
            }}
          >
            {category.name}
          </div>
        ))}
      </div>
      <div style={styles.tabContent}>
        {selectedCategory && (
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: '0 0 200px' }}>
              {subCategories[selectedCategory].map((subCategory) => (
                <div
                  key={subCategory.id}
                  style={{
                    ...styles.sidebarItem,
                    ...(selectedSubCategory === subCategory.id
                      ? styles.activeSidebarItem
                      : {}),
                  }}
                  onClick={() => {
                    setSelectedSubCategory(subCategory.id);
                    setSelectedOperation(null);
                  }}
                >
                  {subCategory.name}
                </div>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              {selectedSubCategory &&
                operations[selectedCategory]?.[selectedSubCategory]?.map(
                  (operation) => (
                    <div
                      key={operation.id}
                      style={{
                        ...styles.sidebarItem,
                        ...(selectedOperation?.id === operation.id
                          ? styles.activeSidebarItem
                          : {}),
                      }}
                      onClick={() => setSelectedOperation(operation)}
                    >
                      {operation.name}
                    </div>
                  )
                )}
              {selectedOperation && renderOperationDetail(selectedOperation)}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAccordionVariant = () => (
    <div style={styles.accordion}>
      {categories.map((category) => (
        <div key={category.id} style={styles.accordionItem}>
          <div
            style={styles.accordionHeader}
            onClick={() => {
              setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              );
              setSelectedSubCategory(null);
              setSelectedOperation(null);
            }}
          >
            <span>{category.name}</span>
            <span>{selectedCategory === category.id ? '−' : '+'}</span>
          </div>
          {selectedCategory === category.id && (
            <div style={styles.accordionContent}>
              {subCategories[category.id].map((subCategory) => (
                <div key={subCategory.id}>
                  <div
                    style={{
                      ...styles.sidebarItem,
                      ...(selectedSubCategory === subCategory.id
                        ? styles.activeSidebarItem
                        : {}),
                    }}
                    onClick={() => {
                      setSelectedSubCategory(
                        selectedSubCategory === subCategory.id
                          ? null
                          : subCategory.id
                      );
                      setSelectedOperation(null);
                    }}
                  >
                    {subCategory.name}
                  </div>
                  {selectedSubCategory === subCategory.id &&
                    operations[category.id]?.[subCategory.id]?.map((operation) => (
                      <div
                        key={operation.id}
                        style={{
                          ...styles.sidebarItem,
                          marginLeft: '20px',
                          ...(selectedOperation?.id === operation.id
                            ? styles.activeSidebarItem
                            : {}),
                        }}
                        onClick={() => setSelectedOperation(operation)}
                      >
                        {operation.name}
                      </div>
                    ))}
                </div>
              ))}
              {selectedOperation && renderOperationDetail(selectedOperation)}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderSidebarVariant = () => (
    <div style={styles.sidebarLayout}>
      <div style={styles.sidebar}>
        {categories.map((category) => (
          <div key={category.id}>
            <div
              style={{
                ...styles.sidebarItem,
                fontWeight: 'bold',
                ...(selectedCategory === category.id ? styles.activeSidebarItem : {}),
              }}
              onClick={() => {
                setSelectedCategory(category.id);
                setSelectedSubCategory(null);
                setSelectedOperation(null);
              }}
            >
              {category.name}
            </div>
            {selectedCategory === category.id &&
              subCategories[category.id].map((subCategory) => (
                <div key={subCategory.id}>
                  <div
                    style={{
                      ...styles.sidebarItem,
                      marginLeft: '15px',
                      ...(selectedSubCategory === subCategory.id
                        ? styles.activeSidebarItem
                        : {}),
                    }}
                    onClick={() => {
                      setSelectedSubCategory(subCategory.id);
                      setSelectedOperation(null);
                    }}
                  >
                    {subCategory.name}
                  </div>
                  {selectedSubCategory === subCategory.id &&
                    operations[category.id]?.[subCategory.id]?.map((operation) => (
                      <div
                        key={operation.id}
                        style={{
                          ...styles.sidebarItem,
                          marginLeft: '30px',
                          ...(selectedOperation?.id === operation.id
                            ? styles.activeSidebarItem
                            : {}),
                        }}
                        onClick={() => setSelectedOperation(operation)}
                      >
                        {operation.name}
                      </div>
                    ))}
                </div>
              ))}
          </div>
        ))}
      </div>
      <div style={styles.mainContent}>
        {selectedOperation ? (
          renderOperationDetail(selectedOperation)
        ) : (
          <div>Select an operation to view details</div>
        )}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.variantSelector}>
        <button
          style={{
            ...styles.variantButton,
            ...(activeVariant === 'tabs' ? styles.activeVariant : {}),
          }}
          onClick={() => setActiveVariant('tabs')}
        >
          Tabs Layout
        </button>
        <button
          style={{
            ...styles.variantButton,
            ...(activeVariant === 'accordion' ? styles.activeVariant : {}),
          }}
          onClick={() => setActiveVariant('accordion')}
        >
          Accordion Layout
        </button>
        <button
          style={{
            ...styles.variantButton,
            ...(activeVariant === 'sidebar' ? styles.activeVariant : {}),
          }}
          onClick={() => setActiveVariant('sidebar')}
        >
          Sidebar Layout
        </button>
      </div>

      {activeVariant === 'tabs' && renderTabsVariant()}
      {activeVariant === 'accordion' && renderAccordionVariant()}
      {activeVariant === 'sidebar' && renderSidebarVariant()}
    </div>
  );
};

export default ExplorerVariants;