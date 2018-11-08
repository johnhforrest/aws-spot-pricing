import React from 'react';
import { connect } from 'react-redux';

import { refreshCache } from 'actions/actions';

import classNames from 'classnames/bind';
import styles from 'css/components/instancecache';

const cx = classNames.bind(styles);

class InstanceCache extends React.Component {
  render() {
    return (
      <div>
        <h2>EC2Instance.info cache</h2>
        <div>Last cached on:</div>
        <div>{'' + new Date(this.props.reducer.lastCached)}</div>
        <input type="button" onClick={this.props.refreshCache} value="Refresh cache" className={cx('button')} />
      </div>
    );
  }
}

InstanceCache.propTypes = {
  reducer: React.PropTypes.object,
  refreshCache: React.PropTypes.func
};

function mapStateToProps({ reducer }) {
  return { reducer };
}

export default connect(mapStateToProps, { refreshCache })(InstanceCache);
