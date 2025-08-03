
import { useAtom } from 'jotai';
import { Box } from '@mui/material';
import { Slider, Typography } from "@mui/material";

import { timestampAtom } from '../atoms';
import { times } from 'lodash';



const Timestamps = () => {

    const [timestamp, setTimestamp] = useAtom(timestampAtom);

    const marks = Array.from({ length: 9 }, (_, i) => ({
        value: i * 6,
        label: `${i}h`
    }));

    return (
        <Box sx={{ width: "100%", paddingLeft: 2, paddingRight: 2 }}>
            <Slider
                value={timestamp}
                onChange={(e, val) => setTimestamp(val)}
                step={1}
                min={0}
                max={40}
                // marks={marks}
                valueLabelDisplay="auto"
            />
        </Box>
    )

}

export default Timestamps;
