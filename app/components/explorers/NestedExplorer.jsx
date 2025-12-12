import React, { useState } from 'react';

const NestedExplorer = () => {
  const [activeVariant, setActiveVariant] = useState('sidebar');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedOperation, setSelectedOperation] = useState(null);

  // Sample data with deeper nesting
  const categories = [
    { id: 'arrays', name: 'Arrays' },
    { id: 'strings', name: 'Strings' },
    { id: 'objects', name: 'Objects' },
  ];

  const subCategories = {
    arrays: [
      { id: 'manipulation', name: 'Array Manipulation' },
      { id: 'iteration', name: 'Array Iteration' },
    ],
    strings: [
      { id: 'transform', name: 'String Transformations' },
      { id: 'validation', name: 'String Validation' },
    ],
    objects: [
      { id: 'properties', name: 'Property Operations' },
      { id: 'methods', name: 'Object Methods' },
    ],
  };

  const groups = {
    arrays: {
      manipulation: [
        { id: 'add', name: 'Adding Elements' },
        { id: 'remove', name: 'Removing Elements' },
      ],
      iteration: [
        { id: 'loop', name: 'Loop Methods' },
        { id: 'functional', name: 'Functional Methods' },
      ],
    },
    strings: {
      transform: [
        { id: 'case', name: 'Case Modification' },
        { id: 'formatting', name: 'String Formatting' },
      ],
      validation: [
        { id: 'regex', name: 'Regular Expressions' },
        { id: 'checks', name: 'Built-in Checks' },
      ],
    },
    objects: {
      properties: [
        { id: 'getset', name: 'Getters & Setters' },
        { id: 'reflection', name: 'Reflection' },
      ],
      methods: [
        { id: 'create', name: 'Creation Methods' },
        { id: 'introspection', name: 'Introspection Methods' },
      ],
    },
  };

  const operations = {
    arrays: {
      manipulation: {
        add: [
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
            id: 'unshift',
            name: 'Array Unshift',
            description: 'Add elements to the beginning of an array',
            syntax: 'array.unshift(element1[, ...[, elementN]])',
            example: `const fruits = ['apple', 'banana'];
fruits.unshift('orange');
console.log(fruits); // ['orange', 'apple', 'banana']`,
            notes: ['Modifies the original array', 'Returns the new length'],
          },
        ],
        remove: [
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
          {
            id: 'shift',
            name: 'Array Shift',
            description: 'Remove the first element from an array',
            syntax: 'array.shift()',
            example: `const fruits = ['apple', 'banana', 'orange'];
const first = fruits.shift();
console.log(fruits); // ['banana', 'orange']`,
            notes: ['Modifies the original array', 'Returns removed element'],
          },
        ],
      },
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
    // Deep sidebar styles
    sidebarLayout: {
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gap: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      minHeight: '600px',
    },
    sidebar: {
      borderRight: '1px solid #ddd',
      padding: '10px',
      background: '#f8f9fa',
      overflowY: 'auto',
      maxHeight: '600px',
    },
    sidebarItem: {
      padding: '8px 10px',
      cursor: 'pointer',
      marginBottom: '3px',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    activeSidebarItem: {
      background: '#e0e7ff',
      color: '#4338ca',
    },
    sidebarItemLabel: {
      flex: 1,
    },
    chevron: {
      transition: 'transform 0.2s',
    },
    chevronOpen: {
      transform: 'rotate(90deg)',
    },
    nestedLevel1: {
      marginLeft: '15px',
    },
    nestedLevel2: {
      marginLeft: '30px',
    },
    nestedLevel3: {
      marginLeft: '45px',
    },
    // Breadcrumb styles
    breadcrumbs: {
      display: 'flex',
      padding: '10px 0',
      gap: '5px',
      alignItems: 'center',
      marginBottom: '15px',
    },
    breadcrumbItem: {
      cursor: 'pointer',
      color: '#4338ca',
    },
    breadcrumbSeparator: {
      margin: '0 5px',
      color: '#888',
    },
    // Content styles
    mainContent: {
      padding: '20px',
    },
    // Accordion styles
    accordion: {
      border: '1px solid #ddd',
      borderRadius: '8px',
    },
    accordionItem: {
      borderBottom: '1px solid #ddd',
    },
    accordionHeader: {
      padding: '12px 15px',
      background: '#f8f9fa',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
    },
    accordionContent: {
      padding: '10px 15px',
    },
    // Operation detail styles
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
    // Treeview styles
    treeviewLayout: {
      display: 'grid',
      gridTemplateColumns: '350px 1fr',
      gap: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      minHeight: '600px',
    },
    treeItem: {
      padding: '8px 10px',
      cursor: 'pointer',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    },
    treeItemIcon: {
      width: '16px',
      height: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    folder: {
      color: '#e3a008',
    },
    file: {
      color: '#3b82f6',
    },
  };

  // Helper function to create breadcrumbs
  const renderBreadcrumbs = () => {
    if (!selectedCategory) return null;

    return (
      <div style={styles.breadcrumbs}>
        <span
          style={styles.breadcrumbItem}
          onClick={() => {
            setSelectedCategory(null);
            setSelectedSubCategory(null);
            setSelectedGroup(null);
            setSelectedOperation(null);
          }}
        >
          Home
        </span>
        <span style={styles.breadcrumbSeparator}>/</span>
        <span
          style={styles.breadcrumbItem}
          onClick={() => {
            setSelectedSubCategory(null);
            setSelectedGroup(null);
            setSelectedOperation(null);
          }}
        >
          {categories.find(c => c.id === selectedCategory)?.name}
        </span>
        
        {selectedSubCategory && (
          <>
            <span style={styles.breadcrumbSeparator}>/</span>
            <span
              style={styles.breadcrumbItem}
              onClick={() => {
                setSelectedGroup(null);
                setSelectedOperation(null);
              }}
            >
              {subCategories[selectedCategory]?.find(sc => sc.id === selectedSubCategory)?.name}
            </span>
          </>
        )}
        
        {selectedGroup && (
          <>
            <span style={styles.breadcrumbSeparator}>/</span>
            <span
              style={styles.breadcrumbItem}
              onClick={() => {
                setSelectedOperation(null);
              }}
            >
              {groups[selectedCategory]?.[selectedSubCategory]?.find(g => g.id === selectedGroup)?.name}
            </span>
          </>
        )}
        
        {selectedOperation && (
          <>
            <span style={styles.breadcrumbSeparator}>/</span>
            <span>{selectedOperation.name}</span>
          </>
        )}
      </div>
    );
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

  // Sidebar with deeper nesting
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
                setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                );
                setSelectedSubCategory(null);
                setSelectedGroup(null);
                setSelectedOperation(null);
              }}
            >
              <span style={styles.sidebarItemLabel}>{category.name}</span>
              <span
                style={{
                  ...styles.chevron,
                  ...(selectedCategory === category.id ? styles.chevronOpen : {}),
                }}
              >
                {'>'}
              </span>
            </div>

            {selectedCategory === category.id &&
              subCategories[category.id]?.map((subCategory) => (
                <div key={subCategory.id}>
                  <div
                    style={{
                      ...styles.sidebarItem,
                      ...styles.nestedLevel1,
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
                      setSelectedGroup(null);
                      setSelectedOperation(null);
                    }}
                  >
                    <span style={styles.sidebarItemLabel}>{subCategory.name}</span>
                    <span
                      style={{
                        ...styles.chevron,
                        ...(selectedSubCategory === subCategory.id
                          ? styles.chevronOpen
                          : {}),
                      }}
                    >
                      {'>'}
                    </span>
                  </div>

                  {selectedSubCategory === subCategory.id &&
                    groups[category.id]?.[subCategory.id]?.map((group) => (
                      <div key={group.id}>
                        <div
                          style={{
                            ...styles.sidebarItem,
                            ...styles.nestedLevel2,
                            ...(selectedGroup === group.id
                              ? styles.activeSidebarItem
                              : {}),
                          }}
                          onClick={() => {
                            setSelectedGroup(
                              selectedGroup === group.id ? null : group.id
                            );
                            setSelectedOperation(null);
                          }}
                        >
                          <span style={styles.sidebarItemLabel}>{group.name}</span>
                          <span
                            style={{
                              ...styles.chevron,
                              ...(selectedGroup === group.id
                                ? styles.chevronOpen
                                : {}),
                            }}
                          >
                            {'>'}
                          </span>
                        </div>

                        {selectedGroup === group.id &&
                          operations[category.id]?.[subCategory.id]?.[group.id]?.map(
                            (operation) => (
                              <div
                                key={operation.id}
                                style={{
                                  ...styles.sidebarItem,
                                  ...styles.nestedLevel3,
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
                      </div>
                    ))}
                </div>
              ))}
          </div>
        ))}
      </div>
      <div style={styles.mainContent}>
        {renderBreadcrumbs()}
        {selectedOperation ? (
          renderOperationDetail(selectedOperation)
        ) : (
          <div>Select an operation to view details</div>
        )}
      </div>
    </div>
  );

  // Accordion with deeper nesting
  const renderAccordionVariant = () => (
    <div style={styles.accordion}>
      {renderBreadcrumbs()}
      {categories.map((category) => (
        <div key={category.id} style={styles.accordionItem}>
          <div
            style={styles.accordionHeader}
            onClick={() => {
              setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              );
              setSelectedSubCategory(null);
              setSelectedGroup(null);
              setSelectedOperation(null);
            }}
          >
            <span>{category.name}</span>
            <span>{selectedCategory === category.id ? '−' : '+'}</span>
          </div>
          {selectedCategory === category.id && (
            <div style={styles.accordionContent}>
              {subCategories[category.id].map((subCategory) => (
                <div key={subCategory.id} style={styles.accordionItem}>
                  <div
                    style={{
                      ...styles.accordionHeader,
                      padding: '10px 15px',
                    }}
                    onClick={() => {
                      setSelectedSubCategory(
                        selectedSubCategory === subCategory.id
                          ? null
                          : subCategory.id
                      );
                      setSelectedGroup(null);
                      setSelectedOperation(null);
                    }}
                  >
                    <span>{subCategory.name}</span>
                    <span>{selectedSubCategory === subCategory.id ? '−' : '+'}</span>
                  </div>
                  {selectedSubCategory === subCategory.id && (
                    <div style={styles.accordionContent}>
                      {groups[category.id][subCategory.id].map((group) => (
                        <div key={group.id} style={styles.accordionItem}>
                          <div
                            style={{
                              ...styles.accordionHeader,
                              padding: '8px 15px',
                            }}
                            onClick={() => {
                              setSelectedGroup(
                                selectedGroup === group.id ? null : group.id
                              );
                              setSelectedOperation(null);
                            }}
                          >
                            <span>{group.name}</span>
                            <span>{selectedGroup === group.id ? '−' : '+'}</span>
                          </div>
                          {selectedGroup === group.id && (
                            <div style={styles.accordionContent}>
                              {operations[category.id]?.[subCategory.id]?.[group.id]?.map(
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
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // Treeview explorer style
  const renderTreeViewVariant = () => (
    <div style={styles.treeviewLayout}>
      <div style={styles.sidebar}>
        {categories.map((category) => (
          <div key={category.id}>
            <div
              style={{
                ...styles.treeItem,
                ...(selectedCategory === category.id ? styles.activeSidebarItem : {}),
              }}
              onClick={() => {
                setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                );
                setSelectedSubCategory(null);
                setSelectedGroup(null);
                setSelectedOperation(null);
              }}
            >
              <span style={{...styles.treeItemIcon, ...styles.folder}}>
                {selectedCategory === category.id ? '📂' : '📁'}
              </span>
              <span>{category.name}</span>
            </div>

            {selectedCategory === category.id &&
              subCategories[category.id]?.map((subCategory) => (
                <div key={subCategory.id}>
                  <div
                    style={{
                      ...styles.treeItem,
                      ...styles.nestedLevel1,
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
                      setSelectedGroup(null);
                      setSelectedOperation(null);
                    }}
                  >
                    <span style={{...styles.treeItemIcon, ...styles.folder}}>
                      {selectedSubCategory === subCategory.id ? '📂' : '📁'}
                    </span>
                    <span>{subCategory.name}</span>
                  </div>

                  {selectedSubCategory === subCategory.id &&
                    groups[category.id]?.[subCategory.id]?.map((group) => (
                      <div key={group.id}>
                        <div
                          style={{
                            ...styles.treeItem,
                            ...styles.nestedLevel2,
                            ...(selectedGroup === group.id
                              ? styles.activeSidebarItem
                              : {}),
                          }}
                          onClick={() => {
                            setSelectedGroup(
                              selectedGroup === group.id ? null : group.id
                            );
                            setSelectedOperation(null);
                          }}
                        >
                          <span style={{...styles.treeItemIcon, ...styles.folder}}>
                            {selectedGroup === group.id ? '📂' : '📁'}
                          </span>
                          <span>{group.name}</span>
                        </div>

                        {selectedGroup === group.id &&
                          operations[category.id]?.[subCategory.id]?.[group.id]?.map(
                            (operation) => (
                              <div
                                key={operation.id}
                                style={{
                                  ...styles.treeItem,
                                  ...styles.nestedLevel3,
                                  ...(selectedOperation?.id === operation.id
                                    ? styles.activeSidebarItem
                                    : {}),
                                }}
                                onClick={() => setSelectedOperation(operation)}
                              >
                                <span style={{...styles.treeItemIcon, ...styles.file}}>📄</span>
                                <span>{operation.name}</span>
                              </div>
                            )
                          )}
                      </div>
                    ))}
                </div>
              ))}
          </div>
        ))}
      </div>
      <div style={styles.mainContent}>
        {renderBreadcrumbs()}
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
            ...(activeVariant === 'sidebar' ? styles.activeVariant : {}),
          }}
          onClick={() => setActiveVariant('sidebar')}
        >
          Nested Sidebar
        </button>
        <button
          style={{
            ...styles.variantButton,
            ...(activeVariant === 'accordion' ? styles.activeVariant : {}),
          }}
          onClick={() => setActiveVariant('accordion')}
        >
          Nested Accordion
        </button>
        <button
          style={{
            ...styles.variantButton,
            ...(activeVariant === 'treeview' ? styles.activeVariant : {}),
          }}
          onClick={() => setActiveVariant('treeview')}
        >
          File Explorer Style
        </button>
      </div>

      {activeVariant === 'sidebar' && renderSidebarVariant()}
      {activeVariant === 'accordion' && renderAccordionVariant()}
      {activeVariant === 'treeview' && renderTreeViewVariant()}
    </div>
  );
};

export default NestedExplorer;