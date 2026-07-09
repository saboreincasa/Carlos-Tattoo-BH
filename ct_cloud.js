/* ============================================================
   ct_cloud.js — Central Tattoo Pro · Sincronização em Nuvem v1.0
   ------------------------------------------------------------
   Como funciona:
   - Intercepta gravações do localStorage nas chaves ct_* e
     replica na tabela ct_dados do Supabase (com debounce).
   - No carregamento, baixa os dados da nuvem e hidrata o
     localStorage. Se algo mudou, recarrega a página UMA vez
     para o app iniciar já com os dados da nuvem.
   - Primeira migração: se a nuvem está vazia e existe dado
     local, sobe tudo automaticamente (nada se perde).
   - Membros autenticados (Supabase Auth): sync ativo.
   - Usuários TRIAL (acesso por token): permanecem 100% locais.
   - O localStorage continua funcionando como cache/fallback:
     sem internet, o app segue operando normalmente.
   ============================================================ */
(function () {
  'use strict';

  /* Chaves que NUNCA sincronizam (sessão e trial são locais) */
  var EXCLUDE = /^ct_(sessao|trial_)/;
  function isSyncKey(k) {
    return typeof k === 'string' && k.indexOf('ct_') === 0 && !EXCLUDE.test(k);
  }

  var state = {
    client: null,   // sbClient da própria Central
    uid: null,      // auth.uid() do membro logado
    ready: false,   // sync ativo?
    timers: {},     // debounce por chave
    pending: {}     // gravações feitas antes do sync ficar pronto
  };

  /* ---------- Envio (localStorage -> nuvem) ---------- */
  function pushKey(k) {
    if (!state.ready) { state.pending[k] = true; return; }
    clearTimeout(state.timers[k]);
    state.timers[k] = setTimeout(function () {
      var v = localStorage.getItem(k);
      state.client
        .from('ct_dados')
        .upsert(
          { user_id: state.uid, chave: k, valor: v, atualizado_em: new Date().toISOString() },
          { onConflict: 'user_id,chave' }
        )
        .then(function (r) {
          if (r.error) console.warn('[ct_cloud] falha ao salvar "' + k + '":', r.error.message);
        });
    }, 800);
  }

  /* ---------- Interceptação do localStorage ---------- */
  var _set = localStorage.setItem.bind(localStorage);
  var _remove = localStorage.removeItem.bind(localStorage);

  localStorage.setItem = function (k, v) {
    _set(k, v);
    if (isSyncKey(k)) pushKey(k);
  };

  localStorage.removeItem = function (k) {
    _remove(k);
    if (isSyncKey(k) && state.ready) {
      state.client.from('ct_dados').delete()
        .match({ user_id: state.uid, chave: k })
        .then(function (r) {
          if (r.error) console.warn('[ct_cloud] falha ao remover "' + k + '":', r.error.message);
        });
    }
  };

  /* ---------- Hidratação (nuvem -> localStorage) ---------- */
  function hydrate() {
    return state.client.from('ct_dados').select('chave,valor').then(function (r) {
      if (r.error) {
        console.warn('[ct_cloud] falha ao carregar nuvem:', r.error.message);
        return { changed: false, cloudEmpty: false, rows: [] };
      }
      var rows = r.data || [];
      var changed = false;
      rows.forEach(function (row) {
        if (!isSyncKey(row.chave)) return;
        var local = localStorage.getItem(row.chave);
        var cloud = row.valor == null ? '' : row.valor;
        if (local !== cloud) { _set(row.chave, cloud); changed = true; }
      });
      return { changed: changed, cloudEmpty: rows.length === 0, rows: rows };
    });
  }

  /* ---------- Primeira migração (local -> nuvem) ---------- */
  function uploadLocal(existingKeys) {
    var batch = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (isSyncKey(k) && existingKeys.indexOf(k) === -1) {
        batch.push({
          user_id: state.uid,
          chave: k,
          valor: localStorage.getItem(k),
          atualizado_em: new Date().toISOString()
        });
      }
    }
    if (!batch.length) return Promise.resolve();
    return state.client
      .from('ct_dados')
      .upsert(batch, { onConflict: 'user_id,chave' })
      .then(function (r) {
        if (r.error) console.warn('[ct_cloud] falha na migração inicial:', r.error.message);
        else console.info('[ct_cloud] migração inicial: ' + batch.length + ' chave(s) enviada(s) para a nuvem.');
      });
  }

  /* ---------- Inicialização ---------- */
  function start(client) {
    state.client = client;
    client.auth.getSession().then(function (res) {
      var session = res && res.data ? res.data.session : null;
      if (!session || !session.user) {
        console.info('[ct_cloud] sem sessão autenticada — modo local (trial). Assine para ter seus dados na nuvem.');
        return;
      }
      state.uid = session.user.id;

      hydrate().then(function (result) {
        var cloudKeys = (result.rows || []).map(function (r) { return r.chave; });
        uploadLocal(cloudKeys).then(function () {
          state.ready = true;

          /* Envia gravações que ficaram pendentes durante o boot */
          Object.keys(state.pending).forEach(pushKey);
          state.pending = {};

          console.info('[ct_cloud] sincronização em nuvem ATIVA para', session.user.email || state.uid);

          /* Se a nuvem trouxe dados diferentes do local, recarrega
             uma única vez para o app iniciar com os dados corretos */
          if (result.changed && !sessionStorage.getItem('ct_cloud_hydrated')) {
            sessionStorage.setItem('ct_cloud_hydrated', '1');
            location.reload();
          }
        });
      });
    });
  }

  /* Aguarda o sbClient que a própria Central cria em initSB() */
  var tries = 0;
  var poll = setInterval(function () {
    tries++;
    if (window.sbClient) {
      clearInterval(poll);
      start(window.sbClient);
    } else if (tries > 100) { /* ~30s */
      clearInterval(poll);
      console.warn('[ct_cloud] sbClient não encontrado — sync desativado nesta sessão.');
    }
  }, 300);
})();
