import React from 'react';
import { Grid } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import axios from 'axios';

import PageTitle from '../../components/PageTitle';
import TableToolbarSelect from "./TableToolbarSelect";

class Tables extends React.Component {
  state = {
    groups: [],
    ids: [],
  }

  componentDidMount() {
    axios.get('https://za7gskmdj6.execute-api.us-east-1.amazonaws.com/dev/monitoring/list?userId=1', {
      headers: {
        'Content-type': 'aplication/json',
        'x-api-key': process.env.REACT_APP_X_API_KEY,
      },
    })
      .then(response => response.data)
      .then(data => {
        let ids = [];
        let groups = data.reduce((acumulador, item) => {
          ids.push(item.id_group);
          delete item.id_group;
          return acumulador.concat([Object.values(item).map(item => item)]);
        }, []);

        console.log(ids);

        this.setState({ 
          groups:  groups,
          ids: ids,
        });
      });
  }
 
  render() {
    return (<React.Fragment>
      <PageTitle title="Monitoramento" />
      <Grid container spacing={32}>
        <Grid item xs={12}>
          <MUIDataTable
            title="Lista de grupos"
            data={this.state.groups}
            columns={["Nome", "Descrição", "Rotina"]} // name, description, rule
            options={{
              filterType: 'checkbox',
              customToolbarSelect:selectedRows => (
                <TableToolbarSelect selectedRows={selectedRows} ids={this.state.ids} />
              )
            }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )};
}

export default Tables;