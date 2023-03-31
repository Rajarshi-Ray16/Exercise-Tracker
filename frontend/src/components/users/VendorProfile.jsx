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


const VendorProfile = (props) => {
  
  const navigate = useNavigate();

  let vendorsTemp, foundVendor;
  const [vendorFound, setVendorFound] = useState();

  let itemsPre;
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    axios
    .get("http://localhost:4000/vendor")
    .then(response => {
      vendorsTemp = response.data;
      vendorsTemp.forEach(vendor => {
        if (vendor.loggedIn === true) {
          foundVendor = vendor.shopName;
          setVendorFound(vendor)
          console.log("Found user. Logging in.");
        }
      });
      // alert("You do not have permission to access this page");
      // navigate("/");
    })
    .catch((error) => {
      console.log(error);
    });

    axios
      .get("http://localhost:4000/vendor/items")
      .then((response) => {
        itemsPre = response.data;
        let itemsPost = [];
        console.log("itemsPre: ", itemsPre);
        itemsPre.forEach((itemPre) => {
          console.log("itemPre: ", itemPre.vendor);
          console.log("foundVendor: ", foundVendor);
          if (itemPre.vendor === foundVendor) {
            itemsPost.push(itemPre);
          }
        });
        console.log("itemsPost: ", itemsPost);
        setItems(itemsPost);
        // setItems(response.data);
        setSearchText("");
      })
      .catch((error) => {
        console.log(error);
      });

  }, [props.id]);
  
  return (
    <div>
        <Grid container>
          <Grid item lg={12}>
            <h3>Vendor Details</h3>
            {console.log("The details are: ", vendorFound)}
            <Paper>
              <Table size="small" align={"center"}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Shop Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Contact Number</TableCell>
                    <TableCell>Opening Time</TableCell>
                    <TableCell>Closing Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* {console.log("We've reached here until now.")}; */}
                  {/* {(vendorFound) => (
                    <TableRow>
                      <TableCell>{vendorFound.vendorName}</TableCell>
                      <TableCell>{vendorFound.shopName}</TableCell>
                      <TableCell>{vendorFound.vendorEmail}</TableCell>
                      <TableCell>{vendorFound.vendorContactNumber}</TableCell>
                      <TableCell>{vendorFound.openingTime}</TableCell>
                      <TableCell>{vendorFound.closingTime}</TableCell>
                    </TableRow>
                  )} */}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item lg={12}>
            <h3>Vendor Items</h3>
            <Paper>
              <Table size="small" align={"center"}>
                <TableHead>
                  <TableRow>
                    <TableCell>Serial No.</TableCell>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Adds-Ons</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* {console.log("We've reached here until now.")}; */}
                  {items.map((item, ind) => (
                    <TableRow key={ind}>
                      <TableCell>{ind + 1}</TableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>{item.addons}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
    
export default VendorProfile;