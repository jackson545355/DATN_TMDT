import { Card, Box, CardContent, Typography, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function InfoCard({ card }) {
  const { mx = 3, my = 0, icon, title, subTitle } = card;

  return (
    <Card elevation={6} sx={{ mx: mx, my: my, borderRadius: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center" }} pl={1}>
        <Box
          p={1}
          m={2}
          sx={{
            display: "flex",
            bgcolor: "primary.main",
            borderRadius: 2,
            alignItems: "center",
          }}
        >
          {icon}
        </Box>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" color="text.secondary" component="div">
            {title}
          </Typography>
          <Typography
            variant="h5"
            fontWeight={"bolder"}
            color="text.secondary"
            component="div"
          >
            {subTitle}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}
