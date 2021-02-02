import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import store from '../lib/store';


import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));


export default function Home({ pull_requests }) {

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </Head>

      {pull_requests.map(({ externalId, evidenceId, merged_at, merged_by, title }) => (
        <Accordion expanded={expanded === externalId} onChange={handleChange(externalId)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.heading}>{new Date(merged_at).toLocaleString()} - {merged_by} - </Typography>
            <Typography className={classes.secondaryHeading}>{title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <img src={`/api/evidence/${evidenceId}`} />
          </AccordionDetails>
        </Accordion>    
      ))}

    </div>
  )
}

export async function getServerSideProps(context) {
  const pull_requests = await store.getPullRequests();
  return {
    props: { pull_requests }
  }
}