'use client'
import React, { useState, useEffect } from 'react';
import SelectComponent2 from '../SelectComponent/SelectComponent2';
import { capitalizeWords } from '@/utils/functions';
import languages from '../../api/db/developement/languages.json';
import DynamicAccordion from '../accordion/DynamicAccordion';
import './MethodExplorer.css'

function MethodExplorer() {
    const languagesNames = languages.map(item => Object.keys(item)[0]);
    const [language, setLanguage] = useState(languagesNames[0]);
    const [objType, setObjType] = useState('');
    const [objects, setObjects] = useState([]);
    const [classificationsArray, setClassificationsArray] = useState([]);
    const [classification, setClassification] = useState('');
    const [data, setData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [link,setLink]=useState('');

    

    

    const handleLanguageChange = (e) => {

        const newLanguage = e.target.value;
        if(!newLanguage.startsWith('Select')){
        setLanguage(newLanguage);
        
        }
    };

    const handleObjChange = (e) => {
        const newObj = e.target.value;
        setObjType(newObj);
        setSearchTerm('')
        setFilteredData([]);
        setClassification('')
        setClassificationsArray([])
    };

    const handleSearchSelection = (e, index) => {
        const newSearchTerm = e.target.value;
        const selectedClassification = classificationsArray[index];
        setClassification(selectedClassification);
        setSearchTerm(newSearchTerm);
    };

    useEffect(() => {
        const languageObject = languages.find(lang => Object.keys(lang)[0].toLowerCase() === language.toLowerCase());

        if (languageObject) {
            const objectArray = Object.values(languageObject)[0];
            const tempObjects = objectArray.map(obj => capitalizeWords(Object.keys(obj)[0]));
            setObjects(tempObjects);

            const objTypeObj = objectArray.find(langObj => Object.keys(langObj)[0].toLowerCase() === objType.toLowerCase());
            if (objTypeObj) {
                const tempClassificationsArray = Object.values(objTypeObj)[0];
                setClassificationsArray(tempClassificationsArray);
            } else {
                setClassificationsArray([]);
            }
        } else {
            setObjects([]);
            setClassificationsArray([]);
        }
    }, [language, objType]);

    useEffect(() => {
        const fetchData = async () => {
            if (language && objType) {
                const response = await fetch(`/api/${language.toLowerCase()}_${objType.toLowerCase()}_Data`);
                if (response.ok) {
                    const data = await response.json();
                    setData(data);
                    setLink(`/${language.toLowerCase()}/${objType.toLowerCase()}/`)
                } else {
                    console.error("Failed to fetch data");
                }
            }
        };

        fetchData();
    }, [language, objType]);

    useEffect(() => {
        if (classification && searchTerm && data) {
            const classificationKey = classification.replace(/\s+/g, '_').toLowerCase();
            const filtered = data.filter(item => {
                const value = item[classificationKey];
                let compareValue;
                if (typeof value === 'boolean') {
                    compareValue = value.toString().toLowerCase();
                } else if (typeof value === 'string') {
                    compareValue = value.toLowerCase();
                }
                return compareValue === searchTerm.toLowerCase();
            });
            setFilteredData(filtered);
            
        } else {
            setFilteredData(data || []);
        }
    }, [classification, searchTerm, data]);


    
    

    return (
        <div className='outer-container'>
            <span>{language}</span>
            {/* <span>{}</span> */}
            {/* <span>{classificationsArray}</span> */}
            {/* <span>{classification}</span> */}
            {/* <span>{searchTerm}</span> */}
            <h3>Methods Explorer</h3>
           
            <SelectComponent2
                label={'Programming Language'}
                options={languagesNames}
                size={'200px'}
                handleChange={handleLanguageChange}
                value={language}
                lookup={' Programming Language'} />
            
            {language && !(language.startsWith('Select')) &&
                <SelectComponent2
                    options={objects}
                    size={'200px'}
                    label={'Data Type '}
                    handleChange={handleObjChange}
                    lookup={' Object Type'} />}
            
             <div className='menu-container'>
            {objType && !(objType.startsWith('Select')) && classificationsArray.map((classification, index) => {
                const uniqueOptions = new Set(data?.map(item => {
                    const value = item[classification.replace(/\s+/g, '_').toLowerCase()];
                    return typeof value === 'boolean' ? capitalizeWords(value.toString()) : capitalizeWords(value);
                }));

                const optionsArray = Array.from(uniqueOptions).filter(Boolean); // Convert Set to Array and filter out falsy values

                return (
                    <div className='select-container'>
                    <SelectComponent2
                        key={index}
                        label={'By ' + capitalizeWords(classification)}
                        options={optionsArray}
                        size={'200px'}
                        lookup={capitalizeWords(classification)}
                        handleChange={(e) => handleSearchSelection(e, index)}
                    />
                    </div>
                );
            })}
            </div>

            {/* {data && language && objType&& <DynamicAccordion data={data} />} */}
            {filteredData && filteredData.length>0 && <><span className='items'>{filteredData.length+' items'}</span>
            <DynamicAccordion
             data={filteredData} 
             link={link}/></>}
        </div>
    );
}

export default MethodExplorer;
