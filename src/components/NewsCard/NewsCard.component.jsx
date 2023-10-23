import React, { useState, useEffect, createRef } from 'react';
import {
  Card,
  CardActions,
  CardActionArea,
  CardMedia,
  CardContent,
  Button,
  Typography,
} from '@material-ui/core';
import useStyles from './NewsCard.styles.js';

const NewsCard = ({
  article: { description, publishedAt, source, title, url, urlToImage },
  activeArticle,
  i,
}) => {
  const [elementRefs, setElementRefs] = useState([]);
  const scrollToRef = (ref) => window.scroll(0, ref.current.offsetTop - 50);

  // this is to set refs for all elements
  useEffect(() => {
    setElementRefs((refs) =>
      Array(20)
        .fill()
        .map((_, j) => refs[j] || createRef())
    );
  }, []);

  //  this is to run on every article reading and scroll with respect to that
  useEffect(() => {
    if (i === activeArticle && elementRefs[activeArticle]) {
      scrollToRef(elementRefs[activeArticle]);
    }
  }, [i, activeArticle, elementRefs]);

  const classes = useStyles();
  return (
    <Card
      ref={elementRefs[i]}
      className={activeArticle === i ? classes.activeCard : classes.card}
    >
      <CardActionArea href={url} target='_blank'>
        <CardMedia
          className={classes.media}
          image={
            urlToImage ||
            'https://www.industry.gov.au/sites/default/files/August%202018/image/news-placeholder-738.png'
          }
        />
        <div className={classes.details}>
          <Typography variant='body2' color='textSecondary' component='h2'>
            {new Date(publishedAt).toDateString()}
          </Typography>
          <Typography variant='body2' color='textSecondary' component='h2'>
            {source.name}
          </Typography>
        </div>
        <Typography
          className={classes.title}
          gutterBottom
          variant='h6'
          style={{ fontSize: 16 }}
        >
          {title}
        </Typography>
        <CardContent>
          <Typography
            variant='body2'
            color='textSecondary'
            component='p'
            style={{ fontSize: 14 }}
          >
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.cardActions}>
        <Button size='small' color='primary'>
          Learn More!
        </Button>
        <Typography variant='h5' color='textSecondary'>
          {i + 1}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default NewsCard;
