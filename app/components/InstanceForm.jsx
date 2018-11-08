import React from 'react';

import classNames from 'classnames/bind';
import styles from 'css/components/form';

const cx = classNames.bind(styles);

class InstanceForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enabled: false
    };

    this.onToggleCheckbox = this.onToggleCheckbox.bind(this);
  }

  onToggleCheckbox(event) {
    const enabled = event.target.checked;

    this.setState({
      enabled
    });

    // bubble up the event to the parent
    this.props.onChange(event);
  }

  render() {
    const wrapperClass = this.state.enabled ? '' : cx('hidden');
    return (
      <div>
        <div className={cx('instanceReq')}>
          <input id="instanceReq" type="checkbox" onChange={this.onToggleCheckbox} />
          <label htmlFor="instanceReq">Enable instance requirements</label>
        </div>
        <div className={wrapperClass}>
          <div className={cx('form')}>
            <h3>Instance requirements</h3>
            <label htmlFor="instanceCpu" className={cx('formLabel')}>Required vCPUs</label>
            <input
              id="instanceCpu"
              type="tel"
              placeholder="Required CPUs (in vCPUs)"
              className={cx('formField')}
              onChange={this.props.onChange}
              required={this.state.enabled}
            />
            <label htmlFor="instanceMemory" className={cx('formLabel')}>Required memory (in GB)</label>
            <input
              id="instanceMemory"
              type="tel"
              placeholder="Required memory (in GB)"
              className={cx('formField')}
              onChange={this.props.onChange}
              required={this.state.enabled}
            />
            <label htmlFor="instanceStorage" className={cx('formLabel')}>Required storage (in GB)</label>
            <input
              id="instanceStorage"
              type="tel"
              placeholder="Required disk space (in GB)"
              className={cx('formField')}
              onChange={this.props.onChange}
              required={this.state.enabled}
            />
          </div>
        </div>
      </div>
    );
  }
}

InstanceForm.propTypes = {
  onChange: React.PropTypes.func
};

export default InstanceForm;
