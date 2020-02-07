((scope) => {

  const spinner = document.querySelector('.spinner');
  const resultContainer = document.querySelector('.result');
  const inputTitle = document.getElementById('title');
  const inputLanguage = document.getElementById('language');
  const toc = document.querySelector('#toc');
  const error404 = document.querySelector('.error-404');
  const error5xx = document.querySelector('.error-5XX');

  const languages = [
    {
      name: 'English',
      selected: true,
      value: 'en'
    }, {
      name: '中文',
      value: 'zh'
    }, {
      name: 'Español',
      value: 'es'
    }, {
      name: 'العربية',
      rtl: true,
      value: 'ar'
    }, {
      name: 'हिन्दी',
      value: 'hi'
    }, {
      name: 'മലയാളം',
      value: 'ml'
    }, {
      name: 'Русский',
      value: 'ru'
    }
  ];

  const show = (element) => {
    element.style.display = 'block';
  };

  const hide = (element) => {
    element.style.removeProperty('display');
  };

  const reset = () => {
    hide(error404);
    hide(error5xx);
    hide(resultContainer);
  };

  const renderList = (list, baseUrl) => {
    return list
      .map((listItem, index) => {
        const previousItem = list[index - 1];
        const isFirstItem = index === 0 || previousItem.toclevel < listItem.toclevel;
        const nextItem = list[index + 1] || {};
        const isLastItem = index === list.length - 1 || listItem.toclevel > nextItem.toclevel;

        return `${isFirstItem ? '<ul>' : ''}<li> <a target="_blank" href="${baseUrl}/${listItem.fromtitle}#${listItem.anchor}">${listItem.number} ${listItem.line}</a></li>${isLastItem ? '</ul>' : ''}`
      })
      .join('')
  };

  const getLanguageInputOption = (language) => {
    const option = document.createElement("option");
    option.value = language.value;
    option.innerHTML = language.name;
    if (language.selected) {
      option.selected = true;
    }
    return option
  };


  const searchPage = (title, language) => {
    const url = `https://${language}.wikipedia.org/w/api.php?origin=*&action=parse&format=json&page=${title}&prop=sections`;

    reset();
    show(spinner);

    return fetch(url)
      .then(response => response.json())
      .then((data) => {
        hide(spinner);
        if (data.parse && data.parse.sections) {
          toc.innerHTML = renderList(data.parse.sections, `https://${language}.wikipedia.org/wiki`);
          show(resultContainer);
        } else {
          show(error404);
        }
      }, () => {
        hide(spinner);
        show(error5xx);
      });
  };

  const onSearch = () => {
    const language = inputLanguage.value;
    const title = inputTitle.value;

    searchPage(title, language);
    return false;
  };

  scope.wiki = {onSearch};

  languages.forEach((language) => {
    inputLanguage.appendChild(getLanguageInputOption(language));
  });

})(window);
