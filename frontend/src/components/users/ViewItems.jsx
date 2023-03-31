import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import List from "@mui/material/List";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";

const ViewItems = (props) => {

    const navigate = useNavigate();
    
    let vendorsTemp, buyersTemp, itemsTemp, productsTemp, foundVendor;
    const [vendorNames, setVendorNames] = useState([]);
    const [buyer, setBuyer] = useState([])
    const [tags, setTags] = useState([]);
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
    
        axios
        .get("http://localhost:4000/vendor")
        .then(response => {
            // setVendors(response.data);
            vendorsTemp = response.data;
            let vendorNameTemp = [];
            vendorsTemp.forEach(vendor => {
                vendorNameTemp.push(vendor.shopName);
            });
            setVendorNames(vendorNameTemp);
        })
        .catch((error) => {
            console.log(error);
        });

        axios
        .get("http://localhost:4000/vendor/items")
        .then(response => {
            itemsTemp = response.data;
            let itemsTagsArray = [];
            itemsTemp.forEach((item) => {
                item.tags.forEach((tag) => {
                    itemsTagsArray.push(tag)
                })
            });
            setTags(itemsTagsArray);
        })
        .catch((error) => {
            console.log(error);
        });

        let buyerTemp;
        
        axios
        .get("http://localhost:4000/buyer")
        .then(response => {
            buyersTemp = response.data;
            buyersTemp.forEach((buyer) => {
                if (buyer.loggedIn === true) {
                    buyerTemp = buyer;
                    setBuyer(buyer);
                }
            });
        })
        .catch((error) => {
            console.log(error);
        });

        axios
        .get("http://localhost:4000/vendor/products")
        .then(response => {
            productsTemp = response.data;
            let productsArray = [];
            productsTemp.forEach((product) => {
                if (product.buyer === buyerTemp.buyerName) {
                    console.log("We are adding an element to the array");
                    productsArray.push(product)
                }
            });
            setProducts(productsArray);
        })
        .catch((error) => {
            console.log(error);
        });

    }, [props.id]);

    const [items, setItems] = useState([]);
    const [checkVendor, setCheckVendor] = useState("");
    const [minPriceItems, setMinPriceItems] = useState([]);
    const [maxPriceItems, setMaxPriceItems] = useState([]);
    const [vegItems, setVegItems] = useState([]);
    const [nonVegItems, setNonVegItems] = useState([]);
    const [searchBarItems, setSearchBarItems] = useState([]);
    const [open, setOpen] = useState(false);
    const [itemDetails, setItemDetails] = useState([]);
    const [itemAddons, setItemAddons] = useState([]);
    const [finalAddons, setFinalAddons] = useState([]);

    const setShow = (argVendorName) => {

        setCheckVendor(argVendorName);
        
        axios
        .get("http://localhost:4000/vendor/items")
        .then(response => {
            // Gets all the data from "items" collections and stores it in vendorsTemp
            itemsTemp = response.data;
            let itemsArray = [];
            // Going through the list of all the items and checking if the name of the
            // vendor of that item is same as that is passed in the function call.
            itemsTemp.forEach((item) => {
                // If they are the same, we'll add the data of the item to the array "itemsArray"
                if (item.vendor === argVendorName) {
                    itemsArray.push(item);
                } 
            });
            setItems(itemsArray);
        })
        .catch((error) => {
            console.log(error);
        });

    }

    const searchMinPrice = (event) => {

        let searchMinPriceItemsArray = [];
        const context = parseInt(event.target.value);
        
        if (context) {
            // console.log("There is something in the min price bar: ", context);
            items.forEach((item) => {
                if (parseInt(item.price) >= context) {
                    // console.log("This item can be added to the min price array: ", item);
                    searchMinPriceItemsArray.push(item);   
                }
            })
            if (searchMinPriceItemsArray.length !== 0) {
                setMinPriceItems(searchMinPriceItemsArray);
            } else {
                setMinPriceItems([1]);
            }
        } else {
            // console.log("There is nothing in the min price bar");
            setMinPriceItems([0]);
        }

        // searchShow();
    
    }

    const searchMaxPrice = (event) => {

        let searchMaxPriceItemsArray = [];
        const context = parseInt(event.target.value);
        
        if (context) {
            // console.log("There is something in the max price bar: ", context);
            items.forEach((item) => {
                if (parseInt(item.price) <= context) {
                    // console.log("This item can be added to the max price array: ", item);
                    searchMaxPriceItemsArray.push(item);   
                }
            })
            if (searchMaxPriceItemsArray.length !== 0) {
                setMaxPriceItems(searchMaxPriceItemsArray);
            } else {
                setMaxPriceItems([1]);
            }
        } else {
            // console.log("There is nothing in the max price bar");
            setMaxPriceItems([0]);
        }

        // searchShow();

    }

    const searchVegetarian = (event) => {
        let checkValue = event.target.checked;
        console.log("The value for the veg checkbox is: ", checkValue);
        let vegItemsTemp = [];
        if (checkValue) {
            console.log("The box is ticked and we'll look through the items");
            items.forEach((item) => {
                if (item.veg === true) {
                    console.log("The item is vegetarian: ", item);
                    vegItemsTemp.push(item);
                }
            })
        }
        if (vegItemsTemp.length !== 0) {
            setVegItems(vegItemsTemp);
        } else {
            setVegItems([1]);
        }
    }

    const searchNonVegetarian = (event) => {
        let checkValue = event.target.checked;
        console.log("The value for the non-veg checkbox is: ", checkValue);
        let nonVegItemsTemp = [];
        if (checkValue) {
            console.log("The box is ticked and we'll look through the items");
            items.forEach((item) => {
                if (item.veg === false) {
                    console.log("The item is non-vegetarian: ", item);
                    nonVegItemsTemp.push(item);
                }
            })
        }
        if (nonVegItemsTemp.length !== 0) {
            setNonVegItems(nonVegItemsTemp);
        } else {
            setNonVegItems([1]);
        }
        // searchShow();
    }

    const searchBar = (event) => {
        let searchBarItemsArray = [];
        const context = event.target.value.toLowerCase();
        if (context) {
            console.log("Something is there in the search bar: ", context);
            items.forEach((item) => {
                if (item.itemName.toLowerCase().includes(context)) {
                    searchBarItemsArray.push(item);
                }
            })

            if (searchBarItemsArray.length !== 0) {
                setSearchBarItems(searchBarItemsArray);
            } else {
                setSearchBarItems([1]);
            }
        } else {
            console.log("Nothing is there in the search bar: ");
            setSearchBarItems([0]);
        }

    }

    const handleClickOpen = (event) => {
      setOpen(true);
      const itemDetailsHCO = event.target.value.split(',');
      let itemAddonsHCO = [...itemDetailsHCO];
      itemAddonsHCO.splice(0, 2);
      setItemDetails(itemDetailsHCO);
      setItemAddons(itemAddonsHCO);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const addonValue = (event) => {
        let context = event.target.checked;
        let contextLabel = event.target.name;
        let itemValue = [...itemDetails];
        let finalAddonsValue = [...finalAddons];
        let price = parseInt(itemValue[1]);

        if (context) {
            price = price + 10;
            itemValue[1] = price;
            finalAddonsValue.push(contextLabel);
            setItemDetails(itemValue);
            setFinalAddons(finalAddonsValue);
        } else {
            price = price - 10;
            itemValue[1] = price;
            let index = finalAddonsValue.indexOf(contextLabel);
            finalAddonsValue.splice(index, 1);
            setItemDetails(itemValue);
            setFinalAddons(finalAddonsValue);
        }
    }

    const buyItem = () => {
        const addProduct = {
            shopName: checkVendor,
            buyerName: buyer.buyerName,
            itemName: itemDetails[0],
            status: "Placed",
            itemAddons: finalAddons,
            orderTime: Date.now(),
            amountToBeSpent: itemDetails[1]
        }

        axios
            .post("http://localhost:4000/buyer/spendfromwallet", addProduct)
            .then(res => {
                console.log("Response", res.data);
                if (res.data.val === 0) {
                    console.log("Some money needs to be spent at the very least.");
                    alert("Some money needs to be spent at the very least.");
                } else if (res.data.val === 1) {
                    console.log("Not enough money in wallet to buy!");
                    alert("Not enough money in wallet to buy!");
                } else if (res.data.val === 2) {
                    console.log("Item bought.");
                    alert("Item bought.");
                }
            });
        setOpen(false);
    }

    const changeStatus = (event) => {
    
        const productName = event.target.value.split(",")[0];
        const productID = event.target.value.split(",")[1];
        const productStatus = event.target.value.split(",")[2];
        const situation = event.target.name;

        const updateProductStatus = {
            productName: productName,
            productID: productID,
            status: productStatus,
            vendorResponse: situation
        }

        axios
            .post("http://localhost:4000/vendor/updateproductstatus", updateProductStatus)
            .then(res => {
                console.log("Response", res.data);
                if (res.data.val === 1) {
                    console.log("Error");
                    alert("Error");
                } else if (res.data.val === 2) {
                    console.log("Status Updated");
                    alert("Status Updated");
                }
            });

        window.location.reload();

    }

    const rateProduct = (value, name) => {

        const rating = {
            itemName: name,
            productRating: value
        }

        console.log("This is what we have put forth: ", rating);

        axios
            .post("http://localhost:4000/buyer/rateproduct", rating)
            .then(res => {
                console.log("Response", res.data);
                if (res.data.val === 1) {
                    console.log("Rating Updated");
                    alert("Rating Updated");
                }
            });

        // window.location.reload();
 
    }

    return (
        <Grid align="center">
            <Grid item xs={3}>
                <Autocomplete
                    id="combo-box-demo"
                    options={vendorNames}
                    getOptionLabel={(option) => option}
                    onChange={(event, value) => setShow(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select the change you wish to make"
                            variant="outlined"
                            placeholder="Choose Vendor"
                        />
                    )}
                />
                <br/>    
            </Grid>
            <Divider />
            <Grid container>
                <Grid item xs={12} md={3} lg={3}>
                    <List component="nav" aria-label="mailbox folders">
                        <ListItem text>
                            <h1>Filters</h1>
                        </ListItem>
                    </List>
                </Grid>
                {/* <Divider orientation={"vertical"} flexItem={true} /> */}
                <Grid item xs={12} md={9} lg={9}>
                    <List component="nav" aria-label="mailbox folders">
                        <TextField
                        id="standard-basic"
                        label="Search"
                        fullWidth={true}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment>
                                    <IconButton>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        onChange={searchBar}
                        />
                    </List>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} md={3} lg={3}>
                    <List component="nav" aria-label="mailbox folders">
                        <ListItem>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    Salary
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="standard-basic"
                                        label="Enter Min"
                                        fullWidth={true}
                                        onChange={searchMinPrice}
                                    />
                                    {/* {console.log("The items in the min price array as of now are: ", minPriceItems)} */}
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="standard-basic"
                                        label="Enter Max"
                                        fullWidth={true}
                                        onChange={searchMaxPrice}
                                    />
                                    {/* {console.log("The items in the max price array as of now are: ", maxPriceItems)} */}
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem>
                           <FormGroup>
                                <FormControlLabel control={
                                    <Checkbox 
                                        defaultChecked
                                        onChange={searchVegetarian} 
                                    />} 
                                    label={"Vegetarian"} 
                                />
                                <FormControlLabel control={
                                    <Checkbox 
                                        defaultChecked
                                        onChange={searchNonVegetarian} 
                                    />} 
                                    label={"Non-Vegetarian"} 
                                />    
                            </FormGroup>
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
            <Divider />
            <Grid>
                <h3>Vendor Items</h3>
                <Paper>
                    <Table align={"center"}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Serial No.</TableCell>
                                <TableCell>Item Name</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Adds-Ons</TableCell>
                                <TableCell>Option</TableCell>
                                <TableCell>Rate</TableCell>
                            </TableRow>
                        </TableHead>
                        {(() => {
                            if (items.length != 0) {
                                let searchItemsArray = [...items];
                                // console.log("This is the search array originally: ", searchItemsArray);
                                // console.log("This is the items array always: ", items)
                                // console.log("The first of items is:", items[0]);   
                                // Case where any one of them xyields no result, then all of them yield no result
                                if ((searchBarItems === [1]) || (minPriceItems === [1]) || (maxPriceItems === [1]) || ((vegItems[0] === 1) && (nonVegItems[0] === 1))) {
                                    console.log("At least one of the clauses yielded 0 results");
                                    return (
                                        <TableBody></TableBody>
                                    )
                                } else {
                                    if ((searchBarItems.length !== 0) && (searchBarItems[0] !== 0)) {
                                        console.log("We're checking the search bar, now.");
                                        console.log("There are these many in the search bar list: ", searchBarItems.length)
                                        // Looking through all the items, one-by-one
                                        searchItemsArray.forEach((searchItem) => {
                                            // Storing the index of the current item in the current search clause list 
                                            const indexC = searchBarItems.indexOf(searchItem);
                                            const indexD = searchItemsArray.indexOf(searchItem);
                                            // Checking whether the items is there in the searchBarItems or not
                                            // (indexC < 0) means that it's not
                                            if (indexC < 0) {
                                                searchItemsArray.splice(indexD, 1);
                                            }
                                        })
                                    }
                                    // console.log("This is the array after search bar search: ", searchItemsArray);
                                    if ((minPriceItems.length !== 0) && (minPriceItems[0] !== 0)) {
                                        console.log("We're checking the minimum price bar, now.");
                                        console.log("There are these many in the minimum price list: ", minPriceItems.length)
                                        // Looking through all the items, one-by-one
                                        searchItemsArray.forEach((searchItem) => {
                                            // Storing the index of the current item in the current search clause list 
                                            const indexC = minPriceItems.indexOf(searchItem);
                                            const indexD = searchItemsArray.indexOf(searchItem);
                                            // Checking whether the items is there in the searchBarItems or not
                                            // (indexC < 0) means that it's not
                                            if (indexC < 0) {
                                                searchItemsArray.splice(indexD, 1);
                                            }
                                        })
                                    }
                                    // console.log("This is the array after minimum price search: ", searchItemsArray);
                                    if ((maxPriceItems.length !== 0) && (maxPriceItems[0] !== 0)) {
                                        // Looking through all the items, one-by-one
                                        searchItemsArray.forEach((searchItem) => {
                                            // Storing the index of the current item in the current search clause list 
                                            const indexC = maxPriceItems.indexOf(searchItem);
                                            const indexD = searchItemsArray.indexOf(searchItem);
                                            // Checking whether the items is there in the searchBarItems or not
                                            // (indexC < 0) means that it's not
                                            if (indexC < 0) {
                                                searchItemsArray.splice(indexD, 1);
                                            }
                                        })
                                    }

                                    if ((vegItems.length !== 0) || (nonVegItems.length !== 0)) {
                                        // In the case where there are vegetarian items in the list of items and no non-veg
                                        if ((vegItems.length !== 0) && (vegItems[0] !== 1) && (nonVegItems[0] === 1))  {
                                            console.log("We're only taking out the non-veg items")
                                            // Looking through all the items, one-by-one
                                            searchItemsArray.forEach((searchItem) => {
                                                // Storing the index of the current item in the current search clause list 
                                                const indexC = vegItems.indexOf(searchItem);
                                                const indexD = searchItemsArray.indexOf(searchItem);
                                                // Checking whether the items is there in the searchBarItems or not
                                                // (indexC < 0) means that it's not
                                                if (indexC < 0) {
                                                    searchItemsArray.splice(indexD, 1);
                                                }
                                            })
                                        // In the case where there are non-vegetarian items in the list of items and no veg
                                        } else if ((nonVegItems.length !== 0) && (nonVegItems[0] !== 1) && (vegItems[0] === 1)) {
                                            console.log("We're only taking out the veg items")
                                            // Looking through all the items, one-by-one
                                            searchItemsArray.forEach((searchItem) => {
                                                // Storing the index of the current item in the current search clause list 
                                                const indexC = nonVegItems.indexOf(searchItem);
                                                const indexD = searchItemsArray.indexOf(searchItem);
                                                // Checking whether the items is there in the searchBarItems or not
                                                // (indexC < 0) means that it's not
                                                if (indexC < 0) {
                                                    searchItemsArray.splice(indexD, 1);
                                                }
                                            })
                                        } else {
                                            console.log("We're looking through both.");
                                            let dualList = vegItems.concat(nonVegItems);
                                            // Looking through all the items, one-by-one
                                            searchItemsArray.forEach((searchItem) => {
                                                // Storing the index of the current item in the current search clause list 
                                                const indexC = dualList.indexOf(searchItem);
                                                const indexD = searchItemsArray.indexOf(searchItem);
                                                // Checking whether the items is there in the searchBarItems or not
                                                // (indexC < 0) means that it's not
                                                if (indexC < 0) {
                                                    searchItemsArray.splice(indexD, 1);
                                                }
                                            })
                                        }
                                    }
                                    // Case where individual, non-overlapping results exist, so nothing will be shown
                                    if (searchItemsArray.length === 0) {
                                        console.log("The total number of results yielded is 0");
                                        return (
                                            <TableBody></TableBody>
                                        )
                                    } else {
                                        return (
                                            <TableBody>
                                                {searchItemsArray.map((item, ind) => (
                                                    <TableRow key={ind}>
                                                        <TableCell>{ind + 1}</TableCell>
                                                        <TableCell>{item.itemName}</TableCell>
                                                        <TableCell>{item.price}</TableCell>
                                                        <TableCell>
                                                            {(item.veg) ? "Vegetarian" : "Non-Vegetarian"}
                                                        </TableCell>
                                                        <TableCell>{item.addons.toString()}</TableCell>
                                                        <TableCell>
                                                            <Button 
                                                                value={[item.itemName, item.price, item.addons]} 
                                                                onClick={handleClickOpen}
                                                            >
                                                                Buy
                                                            </Button>
                                                            <Dialog open={open} onClose={handleClose}>
                                                                <DialogTitle>
                                                                    Buying item: {itemDetails[0]}
                                                                </DialogTitle>
                                                                <DialogContent>
                                                                    <DialogContentText>
                                                                        These are the prices and the addons.
                                                                    </DialogContentText>
                                                                    <FormGroup>
                                                                        <FormControlLabel control={
                                                                            <Checkbox onChange={addonValue} name={"American Cheese"} />}
                                                                            label={"American Cheese"}
                                                                        />
                                                                        <FormControlLabel control={
                                                                            <Checkbox onChange={addonValue} name={"Mayonnaise"} />}
                                                                            label={"Mayonnaise"}
                                                                        />
                                                                    </FormGroup>
                                                                    {/* {(() => {
                                                                        if (itemAddons.length !== 0) {
                                                                        //     return console.log("Working till here.");
                                                                        // }
                                                                            return (
                                                                                <FormGroup>
                                                                                    ({itemAddons.forEach((addon) => {
                                                                                        <FormControlLabel control={
                                                                                            <Checkbox onChange={addonValue} />}
                                                                                            label={addon}
                                                                                        />
                                                                                    })})
                                                                                </FormGroup>
                                                                            )
                                                                        } 
                                                                    })()} */}
                                                                    <TextField
                                                                        autoFocus
                                                                        margin="dense"
                                                                        id="itemPrice"
                                                                        label={itemDetails[1]}
                                                                        type="number"
                                                                        fullWidth
                                                                        variant="standard"
                                                                        disabled
                                                                    />
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button onClick={handleClose}>Cancel</Button>
                                                                    <Button onClick={buyItem}>Buy</Button>
                                                                </DialogActions>
                                                            </Dialog>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Autocomplete
                                                                id="combo-box-demo"
                                                                options={["1", "2", "3", "4", "5"]}
                                                                getOptionLabel={(option) => option}
                                                                onChange={(event, value) => rateProduct(value, item.itemName)}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label="How would you rate this product?"
                                                                        variant="outlined"
                                                                        placeholder="Rating"
                                                                    />
                                                                )}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        )
                                    }
                                }
                            }
                        })()}
                    </Table>
                </Paper>
            </Grid>
            <Divider />
            <Grid>
                <h3>Products Ordered by Customer</h3>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Serial No.</TableCell>
                            <TableCell>Item Name</TableCell>
                            <TableCell>Time of Order</TableCell>
                            <TableCell>Addons</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Complete/Cancel</TableCell>
                        </TableRow>
                    </TableHead>
                    {(() => {
                        if (products.length != 0) {
                            return (
                                <TableBody>
                                    {products.map((product, ind) => (
                                        <TableRow key={ind}>
                                            <TableCell>{ind + 1}</TableCell>
                                            <TableCell>{product.productName}</TableCell>
                                            <TableCell>{product.orderTime}</TableCell>
                                            <TableCell>{product.addons.toString()}</TableCell>
                                            <TableCell>{product.status}</TableCell>
                                            <TableCell>
                                                {(product.status === "Placed") ? 
                                                    <TableCell>
                                                        <Button 
                                                            onClick={changeStatus} 
                                                            name={"cancel"} 
                                                            value={[product.productName, product._id, product.status]}
                                                        >
                                                        Cancel
                                                        </Button>
                                                    </TableCell>
                                                    : ((product.status === "Ready for Pickup") ? 
                                                        <TableCell>
                                                            <Button 
                                                                onClick={changeStatus} 
                                                                name={"update"} 
                                                                value={[product.productName, product._id, product.status]}
                                                            >
                                                            Complete
                                                            </Button>
                                                        </TableCell> 
                                                        : <TableCell>
                                                            <Button disabled>
                                                            Complete
                                                            </Button>
                                                        </TableCell>)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            )
                        } else {
                            return (
                                <TableBody></TableBody>
                            )
                        }
                    })()}
                </Table>
            </Grid>
        </Grid>
    )

}

export default ViewItems;