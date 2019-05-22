import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import { withStyles } from "@material-ui/core/styles";
import {
    Edit as EditIcon,
  } from "@material-ui/icons";

const defaultToolbarSelectStyles = {
  iconButton: {
    marginRight: "24px",
    top: "50%",
    display: "inline-block",
    position: "relative",
    transform: "translateY(-50%)"
  },
  deleteIcon: {
    color: "#000"
  }
};

class TableToolbarSelect extends React.Component {
  getIdsItemByIndexs = (indexs) => {
    let ids = this.props.ids;
    return indexs.map(item => ids.find((id, index) => index === item.index));
  }

  editItem = () => {
    let indexs = this.props.selectedRows.data;
    let ids = this.getIdsItemByIndexs(indexs);

    console.log(ids);
  }

  deleteItem = () => {
    let indexs = this.props.selectedRows.data;
    let ids = this.getIdsItemByIndexs(indexs);  

    console.log(ids);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={"custom-toolbar-select"}>
        <Tooltip title={"Editar"}>
          <IconButton className={classes.iconButton} onClick={this.editItem}>
            <EditIcon className={classes.deleteIcon} />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Excluir"}>
          <IconButton className={classes.iconButton} onClick={this.deleteItem}>
            <DeleteIcon className={classes.deleteIcon} />
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}

export default withStyles(defaultToolbarSelectStyles, {
  name: "TableToolbarSelect"
})(TableToolbarSelect);
