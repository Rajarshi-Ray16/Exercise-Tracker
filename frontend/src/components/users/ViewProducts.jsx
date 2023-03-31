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

const ViewProducts = (props) => {

    const navigate = useNavigate();
    
    let productsTemp, foundVendor;
    // const [vendorNames, setVendorNames] = useState([]);
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
    
        axios
        .get("http://localhost:4000/vendor")
        .then(response => {
            let vendorsTemp = response.data;
            vendorsTemp.forEach(vendor => {
                if (vendor.loggedIn === true) {
                    foundVendor = vendor.shopName;
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
            let productsArray = []
            productsTemp.forEach((product) => {
                if (product.vendor === foundVendor) {
                    productsArray.push(product);
                }
            });
            setProducts(productsArray);
        })
        .catch((error) => {
            console.log(error);
        });

    }, [props.id]);

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

    return (
        <Grid align="center">
            <Grid>
                <h3>Vendor's Dispatched Products</h3>
                <Paper>
                    <Table align={"center"}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Serial No.</TableCell>
                                <TableCell>Item Name</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Time of Order</TableCell>
                                <TableCell>Adds-Ons</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Update</TableCell>
                                <TableCell>Reject</TableCell>
                            </TableRow>
                        </TableHead>
                        {(() => {
                            if (products.length != 0) {
                                return (
                                    <TableBody>
                                        {products.map((product, ind) => (
                                            // if (product.status != "Placed") {

                                            // }
                                            <TableRow key={ind}>
                                                <TableCell>{ind + 1}</TableCell>
                                                <TableCell>{product.productName}</TableCell>
                                                <TableCell>{product.buyer}</TableCell>
                                                <TableCell>{product.orderTime}</TableCell>
                                                <TableCell>{product.addons.toString()}</TableCell>
                                                <TableCell>{product.status}</TableCell>
                                                <TableCell>
                                                    {(product.status === "Placed") ? 
                                                        <TableCell>
                                                            <Button 
                                                                onClick={changeStatus} 
                                                                name={"update"} 
                                                                value={[product.productName, product._id, product.status]}
                                                            >
                                                            Accept
                                                            </Button>
                                                        </TableCell> 
                                                        : ((product.status === "Ready for Pickup" || product.status === "Completed") ? 
                                                            <TableCell>
                                                                <Button disabled>
                                                                    Update
                                                                </Button>
                                                            </TableCell> 
                                                            : <TableCell>
                                                                <Button 
                                                                    onClick={changeStatus} 
                                                                    name={"update"} 
                                                                    value={[product.productName, product._id, product.status]}
                                                                >
                                                                Update
                                                                </Button>
                                                            </TableCell>)}
                                                </TableCell>
                                                    {(product.status === "Placed") ? <TableCell><Button onClick={changeStatus} name={"reject"} value={[product.productName, product.status]}>Reject</Button></TableCell> : <TableCell><Button disabled>Reject</Button></TableCell>}
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
                </Paper>
            </Grid>
        </Grid>
    )

}

export default ViewProducts;