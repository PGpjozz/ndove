import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

type EnquiriesSectionProps = {
  enquiries: any[];
  loadingEnquiries: boolean;
  enquiriesError: string | null;
};

const EnquiriesSection: React.FC<EnquiriesSectionProps> = ({
  enquiries,
  loadingEnquiries,
  enquiriesError,
}) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        Enquiries
      </Typography>
      {loadingEnquiries && <Typography>Loading enquiries...</Typography>}
      {enquiriesError && (
        <Typography color="error" mb={2}>
          {enquiriesError}
        </Typography>
      )}
      {!loadingEnquiries && !enquiriesError && enquiries.length === 0 && (
        <Typography>No enquiries yet.</Typography>
      )}
      {!loadingEnquiries && !enquiriesError && enquiries.length > 0 && (
        <Box sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Full name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enquiries.map((e) => (
                <TableRow key={e.id} hover>
                  <TableCell>{e.full_name}</TableCell>
                  <TableCell>{e.email}</TableCell>
                  <TableCell>{e.phone || "-"}</TableCell>
                  <TableCell>{e.message}</TableCell>
                  <TableCell>
                    {e.created_at ? new Date(e.created_at).toLocaleString() : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Paper>
  );
};

export default EnquiriesSection;
