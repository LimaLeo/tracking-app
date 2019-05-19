import React from 'react';
import { Grid } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import axios from 'axios';

import PageTitle from '../../components/PageTitle';

class Tables extends React.Component {
  state = {
    groups: []
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
        let groups = data.reduce((acumulador, item) => {
          return acumulador.concat([Object.values(item).map(item => item)]);
        }, []);

        this.setState({ groups:  groups});
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
            }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )};
}

export default Tables;