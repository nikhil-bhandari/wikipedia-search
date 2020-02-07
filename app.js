((scope) => {

  const onSearch = () => {
    console.log('searching bro...');

    return false;
  };

  window.wiki = {onSearch};
})(window);
