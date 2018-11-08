import React from 'react';
import InstanceForm from 'components/InstanceForm';

import classNames from 'classnames/bind';
import styles from 'css/components/form';

const cx = classNames.bind(styles);

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cpu: '',
      memory: '',
      storage: '',
      instanceCpu: '',
      instanceMemory: '',
      instanceStorage: '',
      instanceReq: false
    };

    this.elements = {};
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    const newState = {};

    newState[event.target.id] = event.target.id === 'instanceReq'
      ? event.target.checked
      : event.target.value;

    this.setState(newState);
  }

  onSubmit(event) {
    event.preventDefault();

    this.toggleSubmit(false);

    fetch('/calculateOptimalCluster', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then((response) => response.json())
    .then((json) => {
      this.toggleSubmit(true);
      this.props.onSuccess(this.state, json);
    })
    .catch((error) => {
      this.toggleSubmit(true);
      this.setState({
        error
      });
    });
  }

  toggleSubmit(enabled) {
    if (enabled) {
      this.elements.submit.disabled = false;
      this.elements.submit.value = 'Calculate optimal cluster';
    } else {
      this.elements.submit.disabled = true;
      this.elements.submit.value = 'Loading...';
    }
  }

  render() {
    return (
      <form className={cx('form')} onSubmit={this.onSubmit}>
        <h2>Input values</h2>
        <h3>Cluster requirements</h3>
        <label htmlFor="cpu" className={cx('formLabel')}>Required vCPUs</label>
        <input
          id="cpu"
          type="tel"
          placeholder="Required CPUs (in vCPUs)"
          className={cx('formField')}
          onChange={this.onChange}
          autoFocus
          required
        />
        <label htmlFor="memory" className={cx('formLabel')}>Required memory (in GB)</label>
        <input
          id="memory"
          type="tel"
          placeholder="Required memory (in GB)"
          className={cx('formField')}
          onChange={this.onChange}
          required
        />
        <label htmlFor="storage" className={cx('formLabel')}>Required storage (in GB)</label>
        <input
          id="storage"
          type="tel"
          placeholder="Required disk space (in GB)"
          className={cx('formField')}
          onChange={this.onChange}
          required
        />
        <InstanceForm onChange={this.onChange} />
        <input
          type="submit"
          value="Calculate optimal cluster"
          className={cx('formSubmit')}
          ref={(input) => { this.elements.submit = input; }}
        />
      </form>
    );
  }
}

Form.propTypes = {
  onSuccess: React.PropTypes.func
};

export default Form;
