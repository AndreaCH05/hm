import React from 'react';
import PropTypes from 'prop-types';

import {

    Input

} from 'antd';


const ENTER_KEY_CODE = 13;
const DEFAULT_LABEL_PLACEHOLDER = "Click To Edit";

export default class EditableLabel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isEditing: this.props.isEditing || false,
            text: this.props.text || "",
            width: this.props.width || 2,

        };
    }

    componentDidUpdate(prevProps) {
        if(prevProps.text !== this.props.text) {
            this.setState({
                text: this.props.text || "",
            });
        }

        if(prevProps.isEditing !== this.props.isEditing) {
            this.setState({
                isEditing: this.state.isEditing || this.props.isEditing || false
            });
        }
    };

    isTextValueValid = () => {
        return (typeof this.state.text != "undefined" && this.state.text.trim().length > 0);
    };

    handleFocus = () => {
        if(this.state.isEditing) {
            if(typeof this.props.onFocusOut === 'function') {
                this.props.onFocusOut(this.state.text);
            }
        }
        else {
            if(typeof this.props.onFocus === 'function') {
                this.props.onFocus(this.state.text);
            }
        }

        if(this.isTextValueValid()){
            this.setState({
                isEditing: !this.state.isEditing,
            });
        }else{
            if(this.state.isEditing){
                this.setState({
                    isEditing: this.props.emptyEdit || false
                });
            }else{
                this.setState({
                    isEditing: true
                });
            }
        }
    };

    handleChange = () => {
        this.setState({
            text: this.textInput.value,

        });
    };

    handleKeyDown = (e) => {
        if(e.keyCode === ENTER_KEY_CODE){
            this.handleEnterKey();
        }
    };

    handleEnterKey = () => {
        this.handleFocus();
    };

    generateInput = () => {

        if (this.props.type !== undefined && this.props.type == "textarea"){
            return  (
                <textarea
                    id={this.props.id}
                    key={this.props.id}
                    className={this.props.inputClassName}
                    ref={(input) => { this.textInput = input; }}
                    onChange={this.handleChange}
                    onBlur={this.handleFocus}
                    onKeyDown={this.handleKeyDown}
                    style={{
                        width: (this.props.width === undefined)?(parseInt(this.state.text.length) + 1 ) + 'ch':this.props.width,
                        ...this.props.inputStyle
                    }}
                    maxLength={this.props.inputMaxLength}
                    placeholder={this.props.inputPlaceHolder}
                    tabIndex={this.props.inputTabIndex}
                >{this.state.text}</textarea>
            );
        }
        return  <input type="text"
                       id={this.props.id}
                       key={this.props.id}
                       className={this.props.inputClassName}
                       ref={(input) => { this.textInput = input; }}
                       value={this.state.text}
                       onChange={this.handleChange}
                       onBlur={this.handleFocus}
                       onKeyDown={this.handleKeyDown}
                       style={{
                           width: (this.props.width === undefined)?(parseInt(this.state.text.length) + 1 ) + 'ch':this.props.width,
                           ...this.props.inputStyle
                       }}
                       maxLength={this.props.inputMaxLength}
                       placeholder={this.props.inputPlaceHolder}
                       tabIndex={this.props.inputTabIndex}
                       max={this.props.max}
        />;



    };

    render() {
        let stat;
        if (this.props.alwaysInput !== undefined && this.props.alwaysInput)
            stat = true;
        else
            stat = this.state.isEditing;

        if(stat) {

            return <div className={this.props.className}>
                {this.generateInput()}
            </div>
        }

        const labelText = this.isTextValueValid() ? this.state.text : (this.props.labelPlaceHolder || DEFAULT_LABEL_PLACEHOLDER);
        return <div className={this.props.className}>
            <label className={this.props.labelClassName}
                   onClick={this.handleFocus}
                   style={{
                       width: (this.props.width === undefined)?(parseInt(this.state.text.length) + 1 ) + 'ch':this.props.width,
                       ...this.props.labelStyle
                   }}
            >
                {labelText}
            </label>
        </div>;
    }
}

EditableLabel.propTypes = {
    text: PropTypes.string.isRequired,
    isEditing: PropTypes.bool,
    emptyEdit: PropTypes.bool,
    className: PropTypes.string,

    labelClassName: PropTypes.string,
    labelPlaceHolder: PropTypes.string,
    labelStyle: PropTypes.object,


    inputPlaceHolder: PropTypes.string,
    inputTabIndex: PropTypes.number,
    inputClassName: PropTypes.string,
    inputStyle: PropTypes.object,

    onFocus: PropTypes.func,
    onFocusOut: PropTypes.func,
};
