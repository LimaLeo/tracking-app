import React from 'react';
import { Grid } from '@material-ui/core';
import MaterialTable from 'material-table';
import axios from 'axios';
import {
  AddBox,
  Check,
  ArrowUpward,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
} from "@material-ui/icons";

import PageTitle from '../../components/PageTitle';

class Tables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      ids: [],
      columns: [
        { title: 'Nome', field: 'name' },
        { title: 'Descrição', field: 'description' },
        {
          title: 'Rotina',
          field: 'rule',
          lookup: {},
        },
      ],
      tableIcons: {
        Add: AddBox,
        Check: Check,
        Clear: Clear,
        Delete: DeleteOutline,
        DetailPanel: ChevronRight,
        Edit: Edit,
        Export: SaveAlt,
        Filter: FilterList,
        FirstPage: FirstPage,
        LastPage: LastPage,
        NextPage: ChevronRight,
        PreviousPage: ChevronLeft,
        ResetSearch: Clear,
        Search: Search,
        SortArrow: ArrowUpward,
        ThirdStateCheck: Remove,
        ViewColumn: ViewColumn
      },
    }
  }

  componentDidMount() {
    axios.get('https://za7gskmdj6.execute-api.us-east-1.amazonaws.com/dev/rules/list', {
        headers: {
          'Content-type': 'aplication/json',
          'x-api-key': process.env.REACT_APP_X_API_KEY,
        },
      })
        .then(response => response.data)
        .then(data => {
          let rules = data.reduce((previous, item) => {
            previous[item.id_rule] = item.name;
            return previous;
          }, {});
          let columns =  this.state.columns;
          
          columns[2].lookup = rules;
          this.setState({ 
            columns:  columns,
          });
        });
    
    axios.get('https://za7gskmdj6.execute-api.us-east-1.amazonaws.com/dev/monitoring/list?userId=1', {
      headers: {
        'Content-type': 'aplication/json',
        'x-api-key': process.env.REACT_APP_X_API_KEY,
      },
    })
      .then(response => response.data)
      .then(data => {
        this.setState({ 
          data:  data,
        });
      });
  }

  render() {
    return (<React.Fragment>
      <PageTitle title="Monitoramento" />
      <Grid container spacing={32}>
        <Grid item xs={12}>
          <MaterialTable
            icons={this.state.tableIcons}
            title=""
            columns={this.state.columns}
            data={this.state.data}
            localization={{
              toolbar: {
                searchPlaceholder: 'Busca',
              },
              body: {
                  editRow: {
                    deleteText: 'Deseja excluir definitivamente?'
                  }
              },
              pagination: {
                labelDisplayedRows: '{from}-{to} de {count}',
                labelRowsSelect: 'linhas',
              }
            }}
            editable={{
              onRowAdd: newData =>
                new Promise(resolve => {
                  console.log(newData);
                  let id = newData.id_group; 
                  
                  axios.post(`https://za7gskmdj6.execute-api.us-east-1.amazonaws.com/dev/monitoring?groupId=${id}`, {
                      "name": newData.name,
                      "description": newData.description,
                      "rule_id": parseInt(newData.rule),
                      "user_id": 1,
                    }, {
                      headers: {
                        'Content-type': 'aplication/json',
                        'x-api-key': process.env.REACT_APP_X_API_KEY,
                      }
                    })
                    .then(response => response.data)
                    .then(data => {
                      console.log(data);
                      setTimeout(() => {
                        resolve();
                        const data = [...this.state.data];
                        data.push(newData);
                        this.setState({ ...this.state, data });
                      }, 600);
                    });
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise(resolve => {
                  let id = newData.id_group; 
                  
                  axios.patch(`https://za7gskmdj6.execute-api.us-east-1.amazonaws.com/dev/monitoring?groupId=${id}`, {
                      "name": newData.name,
                      "description": newData.description,
                      "rule_id": parseInt(newData.rule),
                      "user_id": parseInt(newData.user),
                    }, {
                      headers: {
                        'Content-type': 'aplication/json',
                        'x-api-key': process.env.REACT_APP_X_API_KEY,
                      }
                    })
                    .then(response => response.data)
                    .then(data => {
                      console.log(data);
                      setTimeout(() => {
                        resolve();
                        const data = [...this.state.data];
                        data[data.indexOf(oldData)] = newData;
                        this.setState({ ...this.state, data });
                      }, 600);
                    });
                }),
              onRowDelete: oldData =>
                new Promise(resolve => {
                  let id = oldData.id_group; 

                  axios.delete(`https://za7gskmdj6.execute-api.us-east-1.amazonaws.com/dev/monitoring?groupId=${id}`, {
                    headers: {
                      'Content-type': 'aplication/json',
                      'x-api-key': process.env.REACT_APP_X_API_KEY,
                    },
                  })
                    .then(response => response.data)
                    .then(result => {
                      console.log(result);
                      setTimeout(() => {
                        resolve();
                        const data = [...this.state.data];
                        data.splice(data.indexOf(oldData), 1);
                        this.setState({ ...this.state, data });
                      }, 600);
                    });
                }),
            }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
    )
  };
}

export default Tables;