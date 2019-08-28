import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';

import QueryAggregator from './QueryAggregator';

const propTypes = {
  location: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
};

const childContextTypes = {
  queryAggregator: PropTypes.object.isRequired,
};

class RelayRouterContext extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.queryAggregator = new QueryAggregator(props);
  }

  getChildContext() {
    return {
      queryAggregator: this.queryAggregator,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.location === this.props.location) {
      return;
    }

    this.queryAggregator.updateQueryConfig(nextProps);
  }

  renderCallback = (renderArgs) => {
    this.queryAggregator.setRenderArgs(renderArgs);
    // Clone element here in order to not fool react into thinking
    // that everything here is fine and dandy and does not need reconciling
    return React.cloneElement(this.props.children, {});
  };

  render() {
    return (
      <Relay.Renderer
        {...this.props}
        Container={this.queryAggregator}
        render={this.renderCallback}
        queryConfig={this.queryAggregator.queryConfig}
      />
    );
  }
}

RelayRouterContext.propTypes = propTypes;
RelayRouterContext.childContextTypes = childContextTypes;

export default RelayRouterContext;
