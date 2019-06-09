import React from "react";
import {
  Grid,
  withStyles,
} from "@material-ui/core";
import Chart from 'react-apexcharts'
import axios from 'axios';

import PageTitle from "../../components/PageTitle";

const styles = theme => ({
  card: {
    minHeight: "100%",
    display: "flex",
    flexDirection: "column"
  },
  visitsNumberContainer: {
    display: "flex",
    alignItems: "center",
    flexGrow: 1,
    paddingBottom: theme.spacing.unit
  },
  progressSection: {
    marginBottom: theme.spacing.unit
  },
  progressTitle: {
    marginBottom: theme.spacing.unit * 2
  },
  progress: {
    marginBottom: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main
  },
  pieChartLegendWrapper: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: theme.spacing.unit
  },
  legendItemContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing.unit
  },
  fullHeightBody: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  tableWidget: {
    overflowX: "auto"
  },
  progressBar: {
    backgroundColor: theme.palette.warning.main
  },
  performanceLegendWrapper: {
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    marginBottom: theme.spacing.unit
  },
  legendElement: {
    display: "flex",
    alignItems: "center",
    marginRight: theme.spacing.unit * 2,
  },
  legendElementText: {
    marginLeft: theme.spacing.unit
  },
  serverOverviewElement: {
    display: "flex",
    alignItems: "center",
    maxWidth: "100%"
  },
  serverOverviewElementText: {
    minWidth: 145,
    paddingRight: theme.spacing.unit * 2
  },
  serverOverviewElementChartWrapper: {
    width: "100%"
  },
  mainChartBody: {
    overflowX: 'auto',
  },
  mainChartHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.only("xs")]: {
      flexWrap: 'wrap',
    }
  },
  mainChartHeaderLabels: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.only("xs")]: {
      order: 3,
      width: '100%',
      justifyContent: 'center',
      marginTop: theme.spacing.unit * 3,
      marginBottom: theme.spacing.unit * 2,
    }
  },
  mainChartHeaderLabel: {
    display: "flex",
    alignItems: "center",
    marginLeft: theme.spacing.unit * 3,
  },
  mainChartSelectRoot: {
    borderColor: theme.palette.text.hint + '80 !important',
  },
  mainChartSelect: {
    padding: 10,
    paddingRight: 25
  },
  mainChartLegentElement: {
    fontSize: '18px !important',
    marginLeft: theme.spacing.unit,
  }
});

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      products: [],
      chartsOptions: [],
      chartsSeries: [],

    }
  }

  getDates(groups) {
    return groups;
  }

  addOption(id, title, categories) {
    return { 
      chart: {
        id: id,
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [5, 7, 5],
        curve: 'straight',
        dashArray: [0, 8, 5]
      },
      title: {
        text: title,
        align: 'left'
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        categories: categories,
      },
      tooltip: {
        y: {
            formatter: function(val) {
                return `R$ ${val}`;
            }   
        }   
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    }
  }

  getCategories(data) {
    return data
      .reduce((dates, item) => {
                dates.push(item.date)
                return dates
          }, 
      [])
      .filter((item, index, array) => {
          return array.indexOf(item) === index;
      });
  }

  getSeries(data) {
    let ids = data.reduce((previous, item) => {
      previous[item.id_product] = item.id_product;
      return previous;
    }, {});
    
    ids = Object.keys(ids).map(item => {
      return item;
    });

    let result = ids
      .reduce((previous, item) => {
        let products = data
          .filter(product => product.id_product == item)
          .reduce((previous, item, index) => {
            previous["name"] = (new URL(item.link)).origin
            if (index == 0) previous["data"] = []
            previous["data"].push(item.value);
            return previous;
          }, {})

        previous.push(products);
        return previous;
      }, []);

    return result;
  } 

  async componentDidMount() {
    await axios.get('https://za7gskmdj6.execute-api.us-east-1.amazonaws.com/dev/monitoring/list?userId=1', {
      headers: {
        'Content-type': 'aplication/json',
        'x-api-key': process.env.REACT_APP_X_API_KEY,
      },
    })
      .then(response => response.data)
      .then(groups => {
        this.setState({
          groups: groups,
        });
      });

    let groups = this.state.groups;

    groups.map(item => {
      axios.get(`https://za7gskmdj6.execute-api.us-east-1.amazonaws.com/dev/prices/monitoring?groupId=${item.id_group}`, {
        headers: {
          'Content-type': 'aplication/json',
          'x-api-key': process.env.REACT_APP_X_API_KEY,
        },
      })
        .then(response => response.data)
        .then(data => {
          console.log(data);
          if (data.length) {
            let id = data[0].id_group || undefined; 
            let title = data[0].description;
            let categories = this.getCategories(data);
            let option = this.addOption(id, title, categories);
            let result = this.getSeries(data);
            
            console.log(option);
  
            let products = this.state.products;
            console.log(result)
            products.push(result);
  
            this.setState({
              products: products,
              chartsOptions: [...this.state.chartsOptions, option],
              chartsSeries: [...this.state.chartsSeries, result],
            });
            console.log(this.state.chartsOptions);
            console.log(this.state.chartsSeries);
          } 
        });
    })
  }

  render() {
    return (
      <React.Fragment>
        <PageTitle title="Dashboard" />
        <Grid container spacing={32}>
          {
            this.state.chartsOptions.map((options, i) => {
              return <Grid item xs={6} key={options.chart.id}>
                      <Chart options={options} series={this.state.chartsSeries[i]} type="line" height={500}/>
                    </Grid>
            })
          }
        </Grid>
      </React.Fragment>
    )
  };
};

export default withStyles(styles, { withTheme: true })(Dashboard);
