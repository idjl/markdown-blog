
// Prism.js core components
var _self = (typeof window !== 'undefined') ? window : (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) ? self : {};
var Prism = (function(){
  var lang = /\blang(?:uage)?-([\w-]+)\b/i;
  var uniqueId = 0;
  var _ = {
    manual: _self.Prism && _self.Prism.manual,
    disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
    util: {
      encode: function(tokens) {
        if (tokens instanceof Token) {
          return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
        } else if (_.util.type(tokens) === 'Array') {
          return tokens.map(_.util.encode);
        } else {
          return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
        }
      },
      type: function(o) {
        return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
      },
      objId: function(obj) {
        if (!obj['__id']) {
          Object.defineProperty(obj, '__id', { value: ++uniqueId });
        }
        return obj['__id'];
      },
      clone: function(o, visited) {
        var type = _.util.type(o);
        visited = visited || {};
        switch (type) {
          case 'Object':
            if (visited[_.util.objId(o)]) {
              return visited[_.util.objId(o)];
            }
            var clone = {};
            visited[_.util.objId(o)] = clone;
            for (var key in o) {
              if (o.hasOwnProperty(key)) {
                clone[key] = _.util.clone(o[key], visited);
              }
            }
            return clone;
          case 'Array':
            if (visited[_.util.objId(o)]) {
              return visited[_.util.objId(o)];
            }
            var clone = [];
            visited[_.util.objId(o)] = clone;
            o.forEach(function (v, i) {
              clone[i] = _.util.clone(v, visited);
            });
            return clone;
        }
        return o;
      }
    },
    languages: {
      extend: function(id, redef) {
        var lang = _.util.clone(_.languages[id]);
        for (var key in redef) {
          lang[key] = redef[key];
        }
        return lang;
      },
      insertBefore: function(inside, before, insert, root) {
        root = root || _.languages;
        var grammar = root[inside];
        var ret = {};
        for (var token in grammar) {
          if (grammar.hasOwnProperty(token)) {
            if (token == before) {
              for (var newToken in insert) {
                if (insert.hasOwnProperty(newToken)) {
                  ret[newToken] = insert[newToken];
                }
              }
            }
            ret[token] = grammar[token];
          }
        }
        return root[inside] = ret;
      },
      DFS: function DFS(o, callback, type, visited) {
        visited = visited || {};
        for (var i in o) {
          if (o.hasOwnProperty(i)) {
            callback.call(o, i, o[i], type || i);
            if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
              visited[_.util.objId(o[i])] = true;
              DFS(o[i], callback, null, visited);
            } else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
              visited[_.util.objId(o[i])] = true;
              DFS(o[i], callback, i, visited);
            }
          }
        }
      }
    },
    plugins: {},
    highlight: function(text, grammar, language) {
      var env = {
        code: text,
        grammar: grammar,
        language: language
      };
      _.hooks.run('before-tokenize', env);
      env.tokens = _.tokenize(env.code, env.grammar);
      _.hooks.run('after-tokenize', env);
      return Token.stringify(_.util.encode(env.tokens), env.language);
    },
    matchGrammar: function(text, strarr, grammar, index, startPos, oneshot, target) {
      for (var token in grammar) {
        if (!grammar.hasOwnProperty(token) || !grammar[token]) {
          continue;
        }
        var patterns = grammar[token];
        patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];
        for (var j = 0; j < patterns.length; ++j) {
          if (target && target == token) {
            return;
          }
          var pattern = patterns[j],
            inside = pattern.inside,
            lookbehind = !!pattern.lookbehind,
            greedy = !!pattern.greedy,
            lookbehindLength = 0,
            alias = pattern.alias;
          if (greedy && !pattern.pattern.global) {
            var flags = pattern.pattern.toString().match(/[imsuy]*$/)[0];
            pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
          }
          pattern = pattern.pattern || pattern;
          for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {
            var str = strarr[i];
            if (strarr.length > text.length) {
              return;
            }
            if (str instanceof Token) {
              continue;
            }
            if (greedy && i != strarr.length - 1) {
              pattern.lastIndex = pos;
              var match = pattern.exec(text);
              if (!match) {
                break;
              }
              var from = match.index + (lookbehind ? match[1].length : 0),
                to = match.index + match[0].length,
                k = i,
                p = pos;
              for (var len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
                p += strarr[k].length;
                if (from >= p) {
                  ++i;
                  pos = p;
                }
              }
              if (strarr[i] instanceof Token) {
                continue;
              }
              delNum = k - i;
              str = text.slice(pos, p);
              match.index -= pos;
            } else {
              pattern.lastIndex = 0;
              var match = pattern.exec(str),
                delNum = 1;
            }
            if (!match) {
              if (oneshot) {
                break;
              }
              continue;
            }
            if(lookbehind) {
              lookbehindLength = match[1] ? match[1].length : 0;
            }
            var from = match.index + lookbehindLength,
              match = match[0].slice(lookbehindLength),
              to = from + match.length,
              before = str.slice(0, from),
              after = str.slice(to);
            var args = [i, delNum];
            if (before) {
              ++i;
              pos += before.length;
              args.push(before);
            }
            var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);
            args.push(wrapped);
            if (after) {
              args.push(after);
            }
            Array.prototype.splice.apply(strarr, args);
            if (delNum != 1) {
              _.matchGrammar(text, strarr, grammar, i, pos, true, token);
            }
            if (oneshot) {
              break;
            }
          }
        }
      }
    },
    tokenize: function(text, grammar, language) {
      var strarr = [text];
      var rest = grammar.rest;
      if (rest) {
        for (var token in rest) {
          grammar[token] = rest[token];
        }
        delete grammar.rest;
      }
      _.matchGrammar(text, strarr, grammar, 0, 0, false);
      return strarr;
    },
    hooks: {
      all: {},
      add: function(name, callback) {
        var hooks = _.hooks.all;
        hooks[name] = hooks[name] || [];
        hooks[name].push(callback);
      },
      run: function(name, env) {
        var callbacks = _.hooks.all[name];
        if (!callbacks || !callbacks.length) {
          return;
        }
        for (var i=0, callback; callback = callbacks[i++];) {
          callback(env);
        }
      }
    }
  };
  var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
    this.type = type;
    this.content = content;
    this.alias = alias;
    this.length = 0 | (matchedStr || "").length;
    this.greedy = !!greedy;
  };
  Token.stringify = function(o, language, parent) {
    if (_.util.type(o) == 'Array') {
      return o.map(function(element) {
        return Token.stringify(element, language, o);
      }).join('');
    } else {
      var env = {
        type: o.type,
        content: Token.stringify(o.content, language, parent),
        tag: 'span',
        classes: ['token', o.type],
        attributes: {},
        language: language,
        parent: parent
      };
      if (o.alias) {
        var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
        Array.prototype.push.apply(env.classes, aliases);
      }
      _.hooks.run('wrap', env);
      var attributes = Object.keys(env.attributes).map(function(name) {
        return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
      }).join(' ');
      if (env.tag == 'span' && !attributes) {
        return env.content;
      } else {
        return '<' + env.tag + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';
      }
    }
  };
  if (!_self.document) {
    if (!_self.addEventListener) {
      return _self.Prism;
    }
    if (!_.disableWorkerMessageHandler) {
      _self.addEventListener('message', function(evt) {
        var message = JSON.parse(evt.data),
          lang = message.language,
          code = message.code,
          immediateClose = message.immediateClose;
        _self.postMessage(_.highlight(code, _.languages[lang], lang));
        if (immediateClose) {
          _self.close();
        }
      }, false);
    }
    return _self.Prism;
  }
  var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();
  if (script) {
    _.filename = script.src;
    if (!_.manual && !script.hasAttribute('data-manual')) {
      if(document.readyState !== "loading") {
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(_.highlightAll);
        } else {
          window.setTimeout(_.highlightAll, 16);
        }
      }
      else {
        document.addEventListener('DOMContentLoaded', _.highlightAll);
      }
    }
  }
  return _self.Prism;
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Prism;
}

if (typeof global !== 'undefined') {
  global.Prism = Prism;
}
