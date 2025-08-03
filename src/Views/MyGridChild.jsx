import { Grid, Box } from "@mui/material";
import useContainerWidth from "@/utils/useContainerWidth";

function MyGridChild() {
    const [containerRef, width] = useContainerWidth();

    return (
        <Box
            ref={containerRef}
            sx={{
                width: "100%",
                height: "100%",
                border: "1px solid red",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            Width: {width}px
        </Box>
    );
}

export default MyGridChild