import React, { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const UsersList = (props) => {

  const [buyers, setBuyers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [sortedBuyers, setSortedBuyers] = useState([]);
  const [sortedVendors, setSortedVendors] = useState([]);
  const [sortNameBuyers, setSortNameBuyers] = useState(true);
  const [sortNameVendors, setSortNameVendors] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/buyer")
      .then((response) => {
        setBuyers(response.data);
        setSortedBuyers(response.data);
        setSearchText("");
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get("http://localhost:4000/vendor")
      .then((response) => {
        setVendors(response.data);
        setSortedVendors(response.data);
        setSearchText("");
      })
      .catch((error) => {
        console.log(error);
      });      
  }, [props.id]);

  const sortChangeBuyers = () => {
    let buyersTemp = buyers;
    const flag = sortNameBuyers;
    buyersTemp.sort((a, b) => {
      if (a.date !== undefined && b.date !== undefined) {
        return (1 - flag * 2) * (new Date(a.date) - new Date(b.date));
      } else {
        return 1;
      }
    });
    setBuyers(buyersTemp);
    setSortNameBuyers(!sortNameBuyers);
  };

  const sortChangeVendors = () => {
    let vendorsTemp = vendors;
    const flag = sortNameVendors;
    vendorsTemp.sort((a, b) => {
      if (a.date !== undefined && b.date !== undefined) {
        return (1 - flag * 2) * (new Date(a.date) - new Date(b.date));
      } else {
        return 1;
      }
    });
    setVendors(vendorsTemp);
    setSortNameVendors(!sortNameVendors);
  };

  return (
    <div>
      <Grid container>
        <Grid item lg={12}>
          <Paper>
            <Table size="small" align={"center"}>
              <TableHead>
                <TableRow>
                  <TableCell> Sr No.</TableCell>
                  <TableCell>
                    {" "}
                    <Button onClick={sortChangeBuyers}>
                      {sortNameBuyers ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                    </Button>
                    Name
                  </TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Contact Number</TableCell>
                  <TableCell>Batch Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {buyers.map((buyer, ind) => (
                  <TableRow key={ind}>
                    <TableCell>{ind + 1}</TableCell>
                    <TableCell>{buyer.buyerName}</TableCell>
                    <TableCell>{buyer.age}</TableCell>
                    <TableCell>{buyer.buyerEmail}</TableCell>
                    <TableCell>{buyer.buyerContactNumber}</TableCell>
                    <TableCell>{buyer.batchName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
      <br/>
      <br/>
      <Grid container>
        <Grid item lg={12}>
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell> Sr No.</TableCell>
                  <TableCell>
                    {" "}
                    <Button onClick={sortChangeVendors}>
                      {sortNameVendors ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                    </Button>
                    Name
                  </TableCell>
                  <TableCell>Shop Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Contact Number</TableCell>
                  <TableCell>Opening Time</TableCell>
                  <TableCell>Closing Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendors.map((vendor, ind) => (
                  <TableRow key={ind}>
                    <TableCell>{ind + 1}</TableCell>
                    <TableCell>{vendor.vendorName}</TableCell>
                    <TableCell>{vendor.shopName}</TableCell>
                    <TableCell>{vendor.vendorEmail}</TableCell>
                    <TableCell>{vendor.vendorContactNumber}</TableCell>
                    <TableCell>{vendor.openingTime}</TableCell>
                    <TableCell>{vendor.closingTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default UsersList;
