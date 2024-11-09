import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import {Link as RouterLink} from "react-router-dom";

const cardData = [
    {
        img: 'https://picsum.photos/800/450?random=3',
        tags: [{title: 'Design'}, {title: 'PHP'}],
        title: 'Designing for the future: trends and insights',
        description:
            'Stay ahead of the curve with the latest design trends and insights. Our design team shares their expertise on creating intuitive and visually stunning user experiences.',
        author: { name: 'Kate Morrison', avatar: '/static/images/avatar/7.jpg' },
    },
    {
        img: 'https://picsum.photos/800/450?random=4',
        tags: [{title: 'UI/UX'}, {title: 'Design'}],
        title: "Our company's journey: milestones and achievements",
        description:
            "Take a look at our company's journey and the milestones we've achieved along the way. From humble beginnings to industry leader, discover our story of growth and success.",
        author: { name: 'Cindy Baker', avatar: '/static/images/avatar/3.jpg' },
    }
];

const SyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height: '100%',
    backgroundColor: (theme.vars || theme).palette.background.paper,
    '&:hover': {
        backgroundColor: 'transparent',
        cursor: 'pointer',
    },
    '&:focus-visible': {
        outline: '3px solid',
        outlineColor: 'hsla(210, 98%, 48%, 0.5)',
        outlineOffset: '2px',
    },
}));

const SyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 16,
    flexGrow: 1,
    '&:last-child': {
        paddingBottom: 16,
    },
});

const StyledTypography = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
});

function Author({ author }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
            }}
        >
            <Box
                sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
            >
                <Avatar
                    key={author.name}
                    alt={author.name}
                    src={author.avatar}
                    sx={{ width: 24, height: 24 }}
                />
                <Typography variant="caption">
                    {author.name}
                </Typography>
            </Box>
            <Typography variant="caption">July 14, 2021</Typography>
        </Box>
    );
}

export default function MainPage() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div>
                <Typography variant="h1" gutterBottom>
                    Blog
                </Typography>
                <Typography>Stay in the loop with the latest about our products</Typography>
            </div>
            <Grid size={{ xs: 12, md: 4 }}>
                <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}
                >
                    <SyledCard
                        variant="outlined"
                        tabIndex={0}
                        sx={{ height: '100%' }}
                    >
                        <SyledCardContent
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%',
                            }}
                        >
                            <div>
                                <Box sx={{ p: 1 }}>
                                    {cardData[0].tags.map((tag) => (
                                        <Chip
                                            key={tag.title}
                                            label={tag.title}
                                            component={RouterLink}
                                            to={`/categories/${tag.title}/posts`}
                                            clickable
                                            sx={{ mr: 1, mb: 1 }}
                                            size="small"
                                        />
                                    ))}
                                </Box>
                                <Typography gutterBottom variant="h6" component="div">
                                    {cardData[0].title}
                                </Typography>
                                <StyledTypography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    {cardData[0].description}
                                </StyledTypography>
                            </div>
                        </SyledCardContent>
                        <Author author={cardData[0].author} />
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 2,
                                alignItems: 'center',
                                // justifyContent: 'space-between',
                                padding: '16px',
                            }}
                        >
                            <Chip icon={<ThumbUpOutlinedIcon />} color="default" variant="outlined" label="15" sx={{
                                border: 'none',
                                boxShadow: 'none',
                            }} />
                            <Chip icon={<MapsUgcOutlinedIcon />} color="default" variant="outlined" label="15" sx={{
                                border: 'none',
                                boxShadow: 'none',
                            }} />
                        </Box>
                    </SyledCard>
                </Box>
            </Grid>
        </Box>
    );
}