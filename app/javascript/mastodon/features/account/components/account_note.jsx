import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import { is } from 'immutable';
import ImmutablePureComponent from 'react-immutable-pure-component';

import Textarea from 'react-textarea-autosize';

const messages = defineMessages({
  placeholder: { id: 'account_note.placeholder', defaultMessage: 'Click to add a note' },
});

const InlineAlert = ({ show }) => {
  const [mountMessage, setMountMessage] = useState(false);

  useEffect(() => {
    if (show) {
      setMountMessage(true);
    } else {
      setTimeout(() => setMountMessage(false), 200);
    }
  }, [show, setMountMessage]);

  return (
    <span aria-live='polite' role='status' className='inline-alert' style={{ opacity: show ? 1 : 0 }}>
      {mountMessage && <FormattedMessage id='generic.saved' defaultMessage='Saved' />}
    </span>
  );
};

InlineAlert.propTypes = {
  show: PropTypes.bool,
};

class AccountNote extends ImmutablePureComponent {

  static propTypes = {
    accountId: PropTypes.string.isRequired,
    value: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    value: null,
    saving: false,
    saved: false,
  };

  UNSAFE_componentWillMount () {
    this._reset();
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const accountWillChange = !is(this.props.accountId, nextProps.accountId);
    const newState = {};

    if (accountWillChange && this._isDirty()) {
      this._save(false);
    }

    if (accountWillChange || nextProps.value === this.state.value) {
      newState.saving = false;
    }

    if (this.props.value !== nextProps.value) {
      newState.value = nextProps.value;
    }

    this.setState(newState);
  }

  componentWillUnmount () {
    if (this._isDirty()) {
      this._save(false);
    }
  }

  setTextareaRef = c => {
    this.textarea = c;
  };

  handleChange = e => {
    this.setState({ value: e.target.value, saving: false });
  };

  handleKeyDown = e => {
    if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();

      this._save();

      if (this.textarea) {
        this.textarea.blur();
      }
    } else if (e.keyCode === 27) {
      e.preventDefault();

      this._reset(() => {
        if (this.textarea) {
          this.textarea.blur();
        }
      });
    }
  };

  handleBlur = () => {
    if (this._isDirty()) {
      this._save();
    }
  };

  _save (showMessage = true) {
    this.setState({ saving: true }, () => this.props.onSave(this.state.value));

    if (showMessage) {
      this.setState({ saved: true }, () => setTimeout(() => this.setState({ saved: false }), 2000));
    }
  }

  _reset (callback) {
    this.setState({ value: this.props.value }, callback);
  }

  _isDirty () {
    return !this.state.saving && this.props.value !== null && this.state.value !== null && this.state.value !== this.props.value;
  }

  render () {
    const { accountId, intl } = this.props;
    const { value, saved } = this.state;

    if (!accountId) {
      return null;
    }

    return (
      <div className='account__header__account-note'>
        <label htmlFor={`account-note-${accountId}`}>
          <FormattedMessage id='account.account_note_header' defaultMessage='Personal note' /> <InlineAlert show={saved} />
        </label>

        <Textarea
          id={`account-note-${accountId}`}
          className='account__header__account-note__content'
          disabled={this.props.value === null || value === null}
          placeholder={intl.formatMessage(messages.placeholder)}
          value={value || ''}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onBlur={this.handleBlur}
          ref={this.setTextareaRef}
        />
      </div>
    );
  }

}

export default injectIntl(AccountNote);
