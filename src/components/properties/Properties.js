import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar'
import BookmarksCard from './BookmarksCard';
import Footer from '../footer/Footer';
import { renderSpinner } from '../common/CommonElements';
import { searchProperty } from '../../services/SearchService';
import { getAllProperties } from '../../services/PropertiesService';
import { filterPropertiesByPrice, isValidPriceRange } from '../../services/priceFilter';

import './Search.css';
import './Properties.css';


const Properties = () => {

    const [propertiesList, setAllPropertiesList] = useState([]);

    const [search, setSearch] = useState({ house_type: "", location: "" });

    const [searchParams, setSearchParams] = useSearchParams();

    const [price, setPrice] = useState({
        minPrice: searchParams.get('minPrice') || "",
        maxPrice: searchParams.get('maxPrice') || ""
    });

    const [priceError, setPriceError] = useState("");

    const [searchList, setSearchList] = useState([]);

    const [dataReady, setDataReady] = useState(false);

    const priceFilterActive = price.minPrice !== "" || price.maxPrice !== "";

    const onSearchSubmit = () => {
        console.log("Search for : ", search, " price: ", price);

        if (!isValidPriceRange(price.minPrice, price.maxPrice)) {
            setPriceError("Min price cannot be greater than max price");
            return;
        }
        setPriceError("");

        // Keep the price filter shareable by reflecting it in the URL.
        const params = {};
        if (price.minPrice !== "") params.minPrice = price.minPrice;
        if (price.maxPrice !== "") params.maxPrice = price.maxPrice;
        setSearchParams(params);

        const applyPriceFilter = (list) =>
            setSearchList(filterPropertiesByPrice(list, price.minPrice, price.maxPrice));

        if (search.house_type === "" && search.location === "") {
            applyPriceFilter(propertiesList);
        } else {
            async function getData() {
                await searchProperty(search)
                    .then(res => {
                        applyPriceFilter(res);
                    })
            }
            getData();
        }


    }

    const handleSearchInputChange = (e) => {
        setSearch({
            ...search,
            [e.target.name]: e.target.value.trim()
        });
    }

    const handlePriceInputChange = (e) => {
        setPrice({
            ...price,
            [e.target.name]: e.target.value
        });
    }

    useEffect(() => {

        async function getData() {
            await getAllProperties()
                .then(res => {
                    setAllPropertiesList(res);
                    // Honour a price filter shared through the URL on load.
                    setSearchList(filterPropertiesByPrice(res, price.minPrice, price.maxPrice));
                    setDataReady(true);
                });
        }

        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* const imageWidth = '250px';
    const imageHeight = '200px'; */
    const imageWidth = '170px';
    const imageHeight = '120px';

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                <Sidebar />
                <div id='properties-container' style={{ width: '100%', backgroundColor: 'white' }}>
                    <div className="proeprtiesBody" style={{ maxHeight: '2600px' }}>
                        <h1 className='propertiesHeader'>Find your Stays</h1>
                        <br></br>
                        <div id='search-container' >

                            <div className='input-group row' style={{ width: '70%' }}>
                                {/* <div className='row'> */}
                                <div className='col'>
                                    <input type="search"
                                        id="search-bar"
                                        className="form-control mr-sm-2"
                                        placeholder='Property Location'
                                        name="location"
                                        onChange={handleSearchInputChange}
                                    ></input>
                                </div>
                                <div className='col'>
                                    <input type="search"
                                        id="search-bar"
                                        className="form-control mr-sm-2"
                                        placeholder='Property type'
                                        name="house_type"
                                        onChange={handleSearchInputChange}
                                    ></input>
                                </div>
                                <div className='col'>
                                    <input type="number"
                                        id="min-price"
                                        className="form-control mr-sm-2"
                                        placeholder='Min price'
                                        name="minPrice"
                                        min="0"
                                        value={price.minPrice}
                                        onChange={handlePriceInputChange}
                                    ></input>
                                </div>
                                <div className='col'>
                                    <input type="number"
                                        id="max-price"
                                        className="form-control mr-sm-2"
                                        placeholder='Max price'
                                        name="maxPrice"
                                        min="0"
                                        value={price.maxPrice}
                                        onChange={handlePriceInputChange}
                                    ></input>
                                </div>
                                <div className='col'>
                                    <button className="btn btn-secondary"
                                        id='search-button'
                                        onClick={onSearchSubmit}>
                                        {/* <i className="bi bi-search"></i> */}
                                        Search
                                    </button>
                                </div>
                                {/* </div> */}

                                {priceError !== "" &&
                                    <div id='price-range-error' style={{ color: 'red', width: '100%', paddingTop: '1%' }}>
                                        {priceError}
                                    </div>
                                }

                            </div>

                            <div id='search-results'>

                            </div>

                        </div>

                        {!dataReady ? renderSpinner() :
                            <div className='propertiesBody'>
                                {searchList.length !== 0 ?

                                    <div className='card-group'>
                                        {searchList?.map((property) => {
                                            return (
                                                <BookmarksCard
                                                    key={property._id}
                                                    property_details={property}
                                                    imageWidth={imageWidth}
                                                    imageHeight={imageHeight}
                                                    flexDirection='row'
                                                />
                                            )
                                        })}
                                    </div>
                                    : <h4 style={{ textAlign: 'center', paddingTop: '5%' }}>
                                        {priceFilterActive ? "No properties in this price range" : "No Properties found..."}
                                    </h4>
                                }

                            </div>}


                        {/* <br></br>
                            <br></br>
                            <br></br>
                        </div> */}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}


export default Properties
