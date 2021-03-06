const slashOptions = {
  STRIP: 'strip',
  ADD: 'add',
};

const modifySlashes = (option, url) => {
  if (!option) {
    return url;
  }

  if (option === slashOptions.ADD) {
    // Hash with slash before is already present
    if (/\/#/.test(url)) {
      return url;
    }
    // Just a hash, it should add slash before
    if (/[^/]#/.test(url)) {
      return url.replace(/([^/])#/, '$1/#');
    }

    // Has a trailing slash? If not, add one
    return /\/$/.test(url) ? url : `${url}/`;
  }

  // Strip
  return /\/$/.test(url) ? url.slice(0, -1) : url.replace('/#', '#');
};

// If no `to` is set, treat as "external" to remove "link style" and bindings.
// Quite useful if you want to bind a link dynamically and don't want to have it clicked and styled when not bound
const isExternal = (props) => !props.to || /^(http|\/\/)/.test(props.to) || props.external;

const wpLinkFactory = (slashes, toApi = false) => ({
  functional: true,
  render: (h, { data, slots, props }) => {
    data.props = props;
    data.props.slashes = data.props.slashes || slashes;

    if (!toApi) {
      data.props.to = data.props.to.replace(process.env.NUXTPRESS_WP_URL, '');
    }

    const isLinkedToExternal = isExternal(data.props);

    if (!isLinkedToExternal) {
      data.props.to = modifySlashes(data.props.slashes, data.props.to);
    }

    const defaultSlots = slots().default;

    return isLinkedToExternal
      ? h(
          'a',
          {
            ...data,
            attrs: {
              ...data.attrs,
              href: data.props.to || undefined,
              rel: data.props.rel || 'noopener',
              target: data.props.target || (data.props.newTab ? '_blank' : undefined),
            },
          },
          defaultSlots
        )
      : h('NuxtLink', data, defaultSlots);
  },
});

export const WpLink = wpLinkFactory(undefined, false);
export const WpLinkAddSlash = wpLinkFactory(slashOptions.ADD, false);
export const WpLinkStripSlash = wpLinkFactory(slashOptions.STRIP, false);
export const WpLinkToApi = wpLinkFactory(undefined, true);

export default WpLink;
