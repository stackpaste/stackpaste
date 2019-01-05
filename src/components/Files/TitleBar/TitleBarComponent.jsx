import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import syntaxes from './syntax';

const styles = theme => ({
  wrapper: {
    height: '48px',
    padding: '8px',
    border: '1px solid #cfd0d2',
  },
  textField: {
    height: '100%',
  },
  margin: {
    margin: theme.spacing.unit,
    height: '100%',
  },
  formControl: {
    minWidth: 120,
    float: 'right',
  },
  select: {
    padding: '14px 14px',
  },
});

class TitleBarComponent extends React.Component {
  state = {
    labelWidth: 0,
  }

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
    });
  }

  handleTitleChange = (evt) => {
    const { file, updateTitle } = this.props;

    updateTitle(file._id, evt.target.value);
  }

  handleSyntaxChange = (evt) => {
    const { file, updateSyntax} = this.props;

    updateSyntax(file._id, evt.target.value);
  }

  handleDelete = () => {
    const { file, deleteFile } = this.props;

    deleteFile(file._id);
  }

  render() {
    const { classes, file } = this.props;
    return (
      <div className={classes.wrapper}>
        <TextField
          placeholder="Filename"
          className={classes.textField}
          value={file.title}
          onChange={this.handleTitleChange}
          variant="outlined"
        />
        <IconButton aria-label="Delete" color="secondary" onClick={this.handleDelete} className={classes.button}>
          <DeleteIcon />
        </IconButton>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel
            ref={(ref) => {
              this.InputLabelRef = ref;
            }}
            htmlFor="outlined-syntax-simple"
          >
            Syntax
          </InputLabel>
          <Select
            value={file.syntax}
            onChange={this.handleSyntaxChange}
            classes={{
              select: classes.select,
            }}
            input={(
              <OutlinedInput
                labelWidth={this.state.labelWidth}
                name="Syntax"
                id="outlined-syntax-simple"
              />
            )}
          >
            {
              Object.keys(syntaxes).map(syntax => (<MenuItem key={syntax} value={syntaxes[syntax]}>{ syntax }</MenuItem>))
            }
          </Select>
        </FormControl>
      </div>
    );
  }
}

TitleBarComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  file: PropTypes.object.isRequired,
  updateTitle: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired,
  updateSyntax: PropTypes.func.isRequired,
};

export default withStyles(styles)(TitleBarComponent);