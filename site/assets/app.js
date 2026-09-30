(function () {
  "use strict";

  var tooltipEl = document.getElementById("tooltip");
  var sidePanel = document.getElementById("sidePanel");
  var sidePanelEval = document.getElementById("sidePanelEval");

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }
  function fmt(n) { return n.toLocaleString("en-US"); }

  // ---------- inline formatting (code, bold, links) ----------
  function renderInline(value) {
    return escapeHtml(value)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }

  Promise.all([
    fetch("data/paper-relations.json").then(function (r) { return r.json(); }),
    fetch("data/paper-dataset-relations.json").then(function (r) { return r.json(); })
  ]).then(function (results) {
    boot(results[0], results[1]);
  }).catch(function (err) {
    document.querySelector(".wrap").insertAdjacentHTML(
      "afterbegin",
      '<p style="color:#c0392b">数据加载失败：' + escapeHtml(err.message) + "</p>"
    );
  });

  var relData, evalData, graphApi;

  function boot(rel, evl) {
    relData = rel;
    evalData = evl;
    renderKpis();
    renderTable();
    graphApi = setupGraph();
    setupEvaluationView();
    setupViewTabs();
  }

  // ---------- KPI tiles ----------
  function renderKpis() {
    var related = relData.links.filter(function (l) { return l.type === "related"; }).length;
    var comparison = relData.links.filter(function (l) { return l.type === "comparison"; }).length;
    var years = Array.from(new Set(relData.papers.map(function (p) { return p.year; }))).sort();
    var tiles = [
      { label: "论文总数", value: fmt(relData.papers.length), sub: years[0] + " – " + years[years.length - 1] },
      { label: "论文关系", value: fmt(relData.links.length), sub: related + " 相关工作 · " + comparison + " 对比方法" },
      { label: "覆盖数据集", value: fmt(evalData.datasets.length), sub: evalData.categories.length + " 个研究类目" },
      { label: "论文-数据集关系", value: fmt(evalData.links.length), sub: evalData.stats.objectiveRecords + " 客观 · " + evalData.stats.subjectiveRecords + " 主观" }
    ];
    document.getElementById("kpiRow").innerHTML = tiles.map(function (t) {
      return '<div class="kpi"><p class="label">' + escapeHtml(t.label) + '</p>' +
        '<p class="value">' + t.value + '</p>' +
        '<p class="sub">' + escapeHtml(t.sub) + '</p></div>';
    }).join("");
  }

  // ---------- view tabs ----------
  function setupViewTabs() {
    var tabs = document.querySelectorAll(".view-tab");
    var graphView = document.getElementById("graphView");
    var evalView = document.getElementById("evalView");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.toggle("is-active", t === tab); });
        var isEval = tab.dataset.view === "evaluation";
        graphView.hidden = isEval;
        evalView.hidden = !isEval;
        if (isEval && graphApi) graphApi.pause();
        if (!isEval && graphApi) { graphApi.resume(); graphApi.resize(); }
      });
    });
  }

  // ---------- table view ----------
  function renderTable() {
    var sorted = relData.papers.slice().sort(function (a, b) { return b.degree - a.degree; });
    document.getElementById("tableBody").innerHTML = sorted.map(function (p) {
      var searchText = (p.name + " " + p.title + " " + (p.organization || "")).toLowerCase();
      return "<tr data-open-paper=\"" + p.id + "\" data-search=\"" + escapeHtml(searchText) + "\">" +
        '<td class="title-cell"><strong>' + escapeHtml(p.name) + "</strong> — " + escapeHtml(p.title) + "</td>" +
        "<td>" + p.year + "</td>" +
        "<td>" + escapeHtml(p.organization || "—") + "</td>" +
        '<td class="num">' + p.degree + "</td>" +
        "</tr>";
    }).join("");
    document.getElementById("tableBody").addEventListener("click", function (evt) {
      var row = evt.target.closest("[data-open-paper]");
      if (!row) return;
      graphApi && graphApi.selectPaper(row.dataset.openPaper);
    });
    document.getElementById("tableToggle").addEventListener("click", function () {
      var wrap = document.getElementById("tableWrap");
      var shell = document.getElementById("graphShell");
      var legend = document.querySelector("#graphView .legend-row");
      var showingTable = !wrap.hidden;
      wrap.hidden = showingTable;
      shell.style.display = showingTable ? "block" : "none";
      legend.style.display = showingTable ? "flex" : "none";
      this.textContent = showingTable ? "切换为表格视图" : "切换回关系图";
    });
  }

  function filterTableRows(query) {
    document.querySelectorAll("#tableBody tr").forEach(function (row) {
      row.hidden = query ? row.dataset.search.indexOf(query) === -1 : false;
    });
  }

  // ---------- tooltip helpers ----------
  function moveTooltip(x, y) {
    var pad = 14;
    var vw = window.innerWidth, vh = window.innerHeight;
    var rect = tooltipEl.getBoundingClientRect();
    var left = Math.min(x + pad, vw - rect.width - pad);
    var top = Math.min(y + pad, vh - rect.height - pad);
    tooltipEl.style.left = Math.max(pad, left) + "px";
    tooltipEl.style.top = Math.max(pad, top) + "px";
  }

  // ---------- graph view ----------
  function setupGraph() {
    var YEARS = Array.from(new Set(relData.papers.map(function (p) { return p.year; }))).sort();

    var degrees = relData.papers.map(function (p) { return p.degree; });
    var minDeg = Math.min.apply(null, degrees), maxDeg = Math.max.apply(null, degrees);
    function rampIndex(d) {
      if (maxDeg === minDeg) return 0;
      return Math.min(5, Math.floor(((d - minDeg) / (maxDeg - minDeg)) * 6));
    }
    function nodeRadius(d) {
      var t = maxDeg === minDeg ? 0 : (d - minDeg) / (maxDeg - minDeg);
      return 4 + Math.sqrt(t) * 7;
    }

    var canvas = document.getElementById("graph");
    var ctx = canvas.getContext("2d");
    var shell = document.getElementById("graphShell");
    var dpr = Math.max(1, window.devicePixelRatio || 1);
    var W = 0, H = 0;
    var running = true;

    function resize() {
      var rect = shell.getBoundingClientRect();
      W = rect.width || 1100;
      H = canvas.clientHeight || 580;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    var bandX = {};

    var nodes = relData.papers.map(function (p) {
      return { p: p, x: 0, y: 0, vx: 0, vy: 0, r: nodeRadius(p.degree), ramp: rampIndex(p.degree) };
    });
    var nodeById = new Map(nodes.map(function (n) { return [n.p.id, n]; }));
    var links = relData.links
      .map(function (l) { return { source: nodeById.get(l.source), target: nodeById.get(l.target), type: l.type }; })
      .filter(function (l) { return l.source && l.target; });

    function seededRand(seed) {
      var x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    }

    function layout() {
      var bandWidth = W / YEARS.length;
      YEARS.forEach(function (y, i) { bandX[y] = bandWidth * (i + 0.5); });

      nodes.forEach(function (n, i) {
        n.x = bandX[n.p.year] + (seededRand(i * 13.37) - 0.5) * bandWidth * 0.7;
        n.y = 90 + seededRand(i * 7.77) * (H - 150);
        n.vx = 0; n.vy = 0;
      });

      var iterations = 260;
      for (var it = 0; it < iterations; it++) {
        for (var a = 0; a < nodes.length; a++) {
          var na = nodes[a];
          var fx = 0, fy = 0;
          for (var b = 0; b < nodes.length; b++) {
            if (a === b) continue;
            var nb = nodes[b];
            var dx = na.x - nb.x, dy = na.y - nb.y;
            var d2 = dx * dx + dy * dy + 0.01;
            var d = Math.sqrt(d2);
            var sameBand = nb.p.year === na.p.year;
            var rep = (sameBand ? 620 : 90) / d2;
            fx += (dx / d) * rep;
            fy += (dy / d) * rep;
          }
          fx += (bandX[na.p.year] - na.x) * 0.035;
          fy += (H / 2 - na.y) * 0.004;
          na.vx = (na.vx + fx) * 0.72;
          na.vy = (na.vy + fy) * 0.72;
        }
        links.forEach(function (l) {
          var dy = l.target.y - l.source.y;
          var dist = Math.abs(dy) || 0.01;
          var f = (dist - 70) * 0.018 * (dy < 0 ? -1 : 1);
          l.source.vy += f;
          l.target.vy -= f;
        });
        nodes.forEach(function (n) {
          n.x += n.vx; n.y += n.vy;
          var margin = n.r + 6;
          n.x = Math.max(margin, Math.min(W - margin, n.x));
          n.y = Math.max(70, Math.min(H - margin, n.y));
          var lane = bandWidth * 0.42;
          n.x = Math.max(bandX[n.p.year] - lane, Math.min(bandX[n.p.year] + lane, n.x));
        });
      }
    }

    function readTokens() {
      var s = getComputedStyle(document.documentElement);
      return {
        ramp: [0, 1, 2, 3, 4, 5].map(function (i) { return s.getPropertyValue("--ramp-" + i).trim(); }),
        edgeIdle: s.getPropertyValue("--edge-idle").trim(),
        edgeHi: s.getPropertyValue("--edge-hi").trim(),
        ink: s.getPropertyValue("--ink").trim(),
        inkMuted: s.getPropertyValue("--ink-muted").trim(),
        surface: s.getPropertyValue("--surface").trim()
      };
    }

    var hovered = null, pinned = null;
    var view = { x: 0, y: 0, scale: 1 };

    function toScreen(n) { return { x: n.x * view.scale + view.x, y: n.y * view.scale + view.y }; }
    function toWorld(px, py) { return { x: (px - view.x) / view.scale, y: (py - view.y) / view.scale }; }

    function neighborsOf(n) {
      var set = new Set();
      links.forEach(function (l) {
        if (l.source === n) set.add(l.target);
        if (l.target === n) set.add(l.source);
      });
      return set;
    }

    function drawArrowhead(ctx2, x, y, ux, uy, size, color) {
      var wing = size * 0.62;
      ctx2.beginPath();
      ctx2.moveTo(x, y);
      ctx2.lineTo(x - ux * size - uy * wing, y - uy * size + ux * wing);
      ctx2.lineTo(x - ux * size + uy * wing, y - uy * size - ux * wing);
      ctx2.closePath();
      ctx2.fillStyle = color;
      ctx2.fill();
    }

    function draw() {
      var t = readTokens();
      ctx.clearRect(0, 0, W, H);

      YEARS.forEach(function (y) {
        var sx = bandX[y] * view.scale + view.x;
        ctx.fillStyle = t.inkMuted;
        ctx.font = "600 11px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.globalAlpha = 0.8;
        ctx.fillText(y, sx, 22);
      });
      ctx.globalAlpha = 1;

      var active = pinned;
      var activeNeighbors = active ? neighborsOf(active) : null;

      links.forEach(function (l) {
        if (l.filteredOut) return;
        var s = toScreen(l.source), e = toScreen(l.target);
        var isActive = active && (l.source === active || l.target === active);
        var dx = e.x - s.x, dy = e.y - s.y;
        var dist = Math.hypot(dx, dy) || 1;
        var ux = dx / dist, uy = dy / dist;
        var startOff = l.source.r * view.scale + 2;
        var endOff = l.target.r * view.scale + 4;
        var sx2 = s.x + ux * startOff, sy2 = s.y + uy * startOff;
        var ex2 = e.x - ux * endOff, ey2 = e.y - uy * endOff;
        var color = isActive ? t.edgeHi : t.edgeIdle;
        ctx.beginPath();
        ctx.moveTo(sx2, sy2);
        ctx.lineTo(ex2, ey2);
        ctx.lineWidth = isActive ? 1.6 : 1;
        ctx.strokeStyle = color;
        ctx.globalAlpha = active ? (isActive ? 0.92 : 0.10) : 0.5;
        ctx.setLineDash(l.type === "comparison" ? [4, 3] : []);
        ctx.stroke();
        ctx.setLineDash([]);
        drawArrowhead(ctx, ex2, ey2, ux, uy, isActive ? 6.5 : 4.5, color);
      });
      ctx.globalAlpha = 1;

      var placedLabels = [];
      var sortedForLabels = nodes.slice().sort(function (a, b) { return b.p.degree - a.p.degree; });

      nodes.forEach(function (n) {
        if (n.filteredOut) return;
        var pt = toScreen(n);
        var dim = active && n !== active && !(activeNeighbors && activeNeighbors.has(n));
        var radius = n.r * view.scale;
        ctx.globalAlpha = dim ? 0.28 : 1;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = t.ramp[n.ramp] || t.ramp[0];
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = t.surface;
        ctx.stroke();
        if (n === active) {
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = t.ink;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, radius + 3, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      });

      var fontSize = W < 620 ? 9 : 10.5;
      ctx.font = "560 " + fontSize + "px -apple-system, 'PingFang SC', sans-serif";
      ctx.textBaseline = "middle";
      sortedForLabels.forEach(function (n) {
        if (n.filteredOut) return;
        var pt = toScreen(n);
        if (pt.x < -20 || pt.x > W + 20 || pt.y < -20 || pt.y > H + 20) return;
        var dim = active && n !== active && !(activeNeighbors && activeNeighbors.has(n));
        var radius = n.r * view.scale;
        var isImportant = n === active || n.p.degree >= maxDeg * 0.55;
        var textWidth = ctx.measureText(n.p.name).width;
        var labelX = pt.x + radius + 5;
        var align = "left";
        if (labelX + textWidth > W - 4) { labelX = pt.x - radius - 5; align = "right"; }
        var boxLeft = align === "left" ? labelX : labelX - textWidth;
        var rect = { l: boxLeft - 2, r: boxLeft + textWidth + 2, t: pt.y - 7, b: pt.y + 7 };
        var collides = !isImportant && placedLabels.some(function (p2) { return rect.l < p2.r && rect.r > p2.l && rect.t < p2.b && rect.b > p2.t; });
        if (collides && view.scale < 1.6) return;
        placedLabels.push(rect);
        ctx.textAlign = align;
        ctx.globalAlpha = dim ? 0.3 : 1;
        ctx.lineJoin = "round";
        ctx.lineWidth = 3;
        ctx.strokeStyle = t.surface;
        ctx.strokeText(n.p.name, labelX, pt.y);
        ctx.fillStyle = n === active ? t.ink : t.inkMuted;
        ctx.fillText(n.p.name, labelX, pt.y);
        ctx.globalAlpha = 1;
      });
    }

    function nearestNode(px, py) {
      var best = null, bestD = Infinity;
      nodes.forEach(function (n) {
        if (n.filteredOut) return;
        var pt = toScreen(n);
        var dx = pt.x - px, dy = pt.y - py;
        var d2 = dx * dx + dy * dy;
        var hitR = n.r * view.scale + 12;
        if (d2 <= hitR * hitR && d2 < bestD) { best = n; bestD = d2; }
      });
      return best;
    }

    function pointerPos(evt) {
      var rect = canvas.getBoundingClientRect();
      return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
    }

    var dragNode = null, panState = null;

    canvas.addEventListener("pointerdown", function (evt) {
      var pos = pointerPos(evt);
      var n = nearestNode(pos.x, pos.y);
      canvas.setPointerCapture(evt.pointerId);
      if (n) {
        dragNode = n;
        pinned = n;
        selectPaper(n.p.id, true);
        draw();
      } else {
        panState = { startX: evt.clientX, startY: evt.clientY, vx: view.x, vy: view.y };
      }
    });
    canvas.addEventListener("pointermove", function (evt) {
      var pos = pointerPos(evt);
      if (dragNode) {
        var w = toWorld(pos.x, pos.y);
        dragNode.x = w.x; dragNode.y = w.y;
        draw();
        return;
      }
      if (panState) {
        view.x = panState.vx + (evt.clientX - panState.startX);
        view.y = panState.vy + (evt.clientY - panState.startY);
        draw();
        return;
      }
      var n = nearestNode(pos.x, pos.y);
      if (n !== hovered) { hovered = n; draw(); }
      if (n) {
        tooltipEl.innerHTML =
          "<strong>" + escapeHtml(n.p.name) + "</strong>" +
          '<div class="meta">' + n.p.year + " · " + escapeHtml(n.p.organization || "机构未知") + "</div>" +
          '<div class="row"><span>关联度</span><span>' + n.p.degree + "</span></div>" +
          '<div class="row"><span>标题</span><span style="text-align:right">' + escapeHtml(n.p.title) + "</span></div>";
        tooltipEl.classList.add("show");
        moveTooltip(evt.clientX, evt.clientY);
        canvas.style.cursor = "pointer";
      } else {
        tooltipEl.classList.remove("show");
        canvas.style.cursor = panState ? "grabbing" : "grab";
      }
    });
    canvas.addEventListener("pointerup", function () { dragNode = null; panState = null; });
    canvas.addEventListener("pointercancel", function () { dragNode = null; panState = null; });
    canvas.addEventListener("pointerleave", function () {
      if (!dragNode && !panState) { hovered = null; tooltipEl.classList.remove("show"); draw(); }
    });
    canvas.addEventListener("wheel", function (evt) {
      evt.preventDefault();
      var pos = pointerPos(evt);
      var factor = evt.deltaY > 0 ? 0.9 : 1.1;
      zoomBy(factor, pos.x, pos.y);
    }, { passive: false });

    function zoomBy(factor, cx, cy) {
      if (cx === undefined) { cx = W / 2; cy = H / 2; }
      var next = Math.max(0.5, Math.min(3.2, view.scale * factor));
      view.x = cx - (cx - view.x) * (next / view.scale);
      view.y = cy - (cy - view.y) * (next / view.scale);
      view.scale = next;
      draw();
    }

    document.getElementById("zoomIn").addEventListener("click", function () { zoomBy(1.25); });
    document.getElementById("zoomOut").addEventListener("click", function () { zoomBy(0.8); });
    document.getElementById("zoomReset").addEventListener("click", function () { view = { x: 0, y: 0, scale: 1 }; draw(); });

    function selectPaper(id, skipScrollIntoView) {
      var n = nodeById.get(id);
      if (!n) return;
      pinned = n;
      renderPaperPanel(n.p);
      draw();
    }

    function renderPaperPanel(p) {
      var relatedTitles = [], comparedTitles = [];
      links.forEach(function (l) {
        var n = nodeById.get(p.id);
        if (l.source !== n && l.target !== n) return;
        var other = l.source === n ? l.target : l.source;
        (l.type === "comparison" ? comparedTitles : relatedTitles).push(other);
      });
      function listItems(arr) {
        if (!arr.length) return '<li style="color:var(--ink-muted)">无</li>';
        return arr.map(function (n2) { return '<li><button data-open-paper="' + n2.p.id + '">' + escapeHtml(n2.p.name) + "</button></li>"; }).join("");
      }
      var codeLine = p.codeUrl
        ? '<a href="' + escapeHtml(p.codeUrl) + '" target="_blank" rel="noopener">代码仓库 ↗</a>'
        : "未提供代码地址";
      sidePanel.hidden = false;
      sidePanel.innerHTML =
        '<button class="panel-close" data-close-panel title="关闭">×</button>' +
        '<div class="detail-header">' +
        '<span class="year-badge">' + p.year + "</span>" +
        "<h3>" + escapeHtml(p.name) + "</h3>" +
        '<p class="full-title">' + escapeHtml(p.title) + "</p>" +
        "</div>" +
        '<div>' +
        '<p class="detail-meta">' + escapeHtml(p.organization || "机构未知") + " · " + codeLine + "</p>" +
        '<p class="detail-abstract">' + escapeHtml(p.abstract || "暂无摘要") + "</p>" +
        '<div class="detail-links"><h4>相关工作提及 (' + relatedTitles.length + ")</h4><ul>" + listItems(relatedTitles) + "</ul></div>" +
        '<div class="detail-links"><h4>对比方法 (' + comparedTitles.length + ")</h4><ul>" + listItems(comparedTitles) + "</ul></div>" +
        "</div>";

      sidePanel.querySelectorAll("[data-open-paper]").forEach(function (btn) {
        btn.addEventListener("click", function () { selectPaper(this.dataset.openPaper); });
      });
      sidePanel.querySelector("[data-close-panel]").addEventListener("click", function () {
        pinned = null;
        sidePanel.hidden = true;
        draw();
      });
    }

    function legendYears() {
      document.getElementById("legendYears").textContent = "度数 " + minDeg + " – " + maxDeg;
    }

    function renderFilters() {
      var yearSelect = document.getElementById("yearSelect");
      var typeSelect = document.getElementById("typeSelect");
      var activeYears = new Set(YEARS);
      var activeTypes = new Set(["related", "comparison"]);
      var query = "";

      document.getElementById("graphSearch").addEventListener("input", function () {
        query = this.value.trim().toLowerCase();
        applyFilters();
        filterTableRows(query);
      });

      YEARS.forEach(function (y) {
        var opt = document.createElement("option");
        opt.value = String(y);
        opt.textContent = y;
        yearSelect.appendChild(opt);
      });
      yearSelect.addEventListener("change", function () {
        activeYears = this.value === "all" ? new Set(YEARS) : new Set([Number(this.value)]);
        applyFilters();
      });

      typeSelect.addEventListener("change", function () {
        activeTypes = this.value === "both" ? new Set(["related", "comparison"]) : new Set([this.value]);
        applyFilters();
      });

      function applyFilters() {
        nodes.forEach(function (n) {
          var yearOk = activeYears.has(n.p.year);
          var queryOk = !query || (n.p.name + " " + n.p.title + " " + (n.p.organization || "")).toLowerCase().indexOf(query) !== -1;
          n.filteredOut = !yearOk || !queryOk;
        });
        links.forEach(function (l) { l.filteredOut = l.source.filteredOut || l.target.filteredOut || !activeTypes.has(l.type); });
        if (hovered && hovered.filteredOut) hovered = null;
        if (pinned && pinned.filteredOut) { pinned = null; sidePanel.hidden = true; }
        draw();
      }
    }

    window.addEventListener("resize", debounce(function () { resize(); layout(); draw(); }, 150));

    resize();
    layout();
    renderFilters();
    legendYears();
    draw();

    return {
      selectPaper: selectPaper,
      pause: function () { running = false; },
      resume: function () { running = true; },
      resize: function () { resize(); draw(); }
    };
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      clearTimeout(t);
      var args = arguments;
      t = setTimeout(function () { fn.apply(null, args); }, ms);
    };
  }

  // ---------- evaluation view ----------
  var evalState = { perspective: "dataset", category: "all", nature: "all", query: "" };
  var openEvalEntity = null;

  function normalizeClientName(v) {
    return String(v || "").normalize("NFKD").toLowerCase().replace(/[^a-z0-9一-鿿]+/g, "");
  }

  function datasetById(id) { return evalData.datasets.find(function (d) { return d.id === id; }); }
  function linksForDataset(id) { return evalData.links.filter(function (l) { return l.datasetId === id; }); }
  function linksForPaper(paperId) { return evalData.links.filter(function (l) { return l.paperId === paperId; }); }
  function paperById(id) { return relData.papers.find(function (p) { return p.id === id; }); }

  function papersUsingDatasets() {
    var byPaper = new Map();
    evalData.links.forEach(function (l) {
      if (!l.paperId) return;
      if (!byPaper.has(l.paperId)) byPaper.set(l.paperId, []);
      byPaper.get(l.paperId).push(l);
    });
    return Array.from(byPaper.entries()).map(function (entry) {
      var paper = paperById(entry[0]);
      return { paperId: entry[0], paper: paper, uses: entry[1] };
    }).filter(function (e) { return e.paper; });
  }

  function selectPerspective(p) {
    evalState.perspective = p;
    document.getElementById("perspectiveSelect").value = p;
    renderEvalList();
  }

  function renderJudgmentLegend() {
    var jm = evalData.judgmentModel;
    var body = document.getElementById("judgmentLegendBody");
    if (!jm || !body) return;
    var natureRows = jm.nature.map(function (r) {
      return "<tr><td><strong>" + escapeHtml(r.nature) + "</strong></td><td>" + escapeHtml(r.criterion) + "</td><td>" + escapeHtml(r.examples) + "</td></tr>";
    }).join("");
    var scorerRows = jm.scorer.map(function (r) {
      return "<tr><td><strong>" + escapeHtml(r.scorer) + "</strong></td><td>" + escapeHtml(r.note) + "</td></tr>";
    }).join("");
    var notes = jm.notes.map(function (n) { return "<li>" + renderInline(n) + "</li>"; }).join("");
    body.innerHTML =
      "<table><thead><tr><th>评价性质</th><th>判定标准</th><th>典型情形</th></tr></thead><tbody>" + natureRows + "</tbody></table>" +
      "<table><thead><tr><th>评分器/执行方式</th><th>说明</th></tr></thead><tbody>" + scorerRows + "</tbody></table>" +
      (notes ? "<ul class=\"legend-notes\">" + notes + "</ul>" : "");
  }

  function setupEvaluationView() {
    renderJudgmentLegend();
    var perspectiveSelect = document.getElementById("perspectiveSelect");
    var categorySelect = document.getElementById("categorySelect");
    var natureSelect = document.getElementById("natureSelect");
    var search = document.getElementById("evalSearch");

    perspectiveSelect.addEventListener("change", function () { selectPerspective(this.value); });

    evalData.categories.forEach(function (cat) {
      var opt = document.createElement("option");
      opt.value = cat.id;
      opt.textContent = cat.id + " · " + cat.title;
      categorySelect.appendChild(opt);
    });
    categorySelect.addEventListener("change", function () {
      evalState.category = this.value;
      renderEvalList();
    });

    natureSelect.addEventListener("change", function () {
      evalState.nature = this.value;
      renderEvalList();
      if (openEvalEntity && openEvalEntity.type === "dataset") openDatasetDetail(openEvalEntity.id);
      else if (openEvalEntity && openEvalEntity.type === "paper") openPaperEvalDetail(openEvalEntity.id);
    });

    search.addEventListener("input", function () {
      evalState.query = this.value.trim().toLowerCase();
      renderEvalList();
    });

    renderEvalList();
  }

  function natureMatches(nature) {
    return evalState.nature === "all" || nature === evalState.nature;
  }

  function renderEvalList() {
    var list = document.getElementById("evalList");
    var query = evalState.query;
    if (evalState.perspective === "dataset") {
      var entries = evalData.datasets.map(function (d) {
        var recs = linksForDataset(d.id).filter(function (r) { return natureMatches(r.nature); });
        var paperIds = new Set(recs.map(function (r) { return r.paperId; }).filter(Boolean));
        return { id: d.id, name: d.name, dataset: d, recs: recs, count: paperIds.size };
      }).filter(function (e) {
        if (evalState.category !== "all" && e.dataset.categoryId !== evalState.category) return false;
        if (evalState.nature !== "all" && !e.recs.length) return false;
        if (!query) return true;
        return (e.id + " " + e.name + " " + e.dataset.description).toLowerCase().includes(query);
      }).sort(function (a, b) { return b.count - a.count || a.id.localeCompare(b.id); });
      list.innerHTML = entries.length ? entries.map(function (e) {
        return '<button class="eval-card" data-dataset="' + escapeHtml(e.id) + '">' +
          '<span class="code">' + escapeHtml(e.id) + "</span>" +
          '<span class="main"><strong>' + escapeHtml(e.name) + '</strong><small>' + escapeHtml(e.dataset.description || "") + "</small></span>" +
          '<span class="usage"><strong>' + e.count + '</strong><small>篇论文</small></span>' +
          "</button>";
      }).join("") : '<div class="eval-empty">没有匹配的数据集</div>';
      list.querySelectorAll("[data-dataset]").forEach(function (btn) {
        btn.addEventListener("click", function () { openDatasetDetail(this.dataset.dataset); highlightCard(btn); });
      });
    } else {
      var pentries = papersUsingDatasets().map(function (e) {
        var uses = e.uses.filter(function (u) { return natureMatches(u.nature); });
        return Object.assign({}, e, { uses: uses });
      }).filter(function (e) {
        if (evalState.nature !== "all" && !e.uses.length) return false;
        if (evalState.category !== "all") {
          var ok = e.uses.some(function (u) { var d = datasetById(u.datasetId); return d && d.categoryId === evalState.category; });
          if (!ok) return false;
        }
        if (!query) return true;
        return (e.paper.name + " " + e.paper.title).toLowerCase().includes(query);
      }).sort(function (a, b) { return b.uses.length - a.uses.length; });
      list.innerHTML = pentries.length ? pentries.map(function (e) {
        var dsNames = Array.from(new Set(e.uses.map(function (u) { var d = datasetById(u.datasetId); return d ? d.name : u.datasetId; })));
        return '<button class="eval-card" data-paper="' + escapeHtml(e.paperId) + '">' +
          '<span class="code">' + e.paper.year + "</span>" +
          '<span class="main"><strong>' + escapeHtml(e.paper.name) + '</strong><small>' + escapeHtml(dsNames.slice(0, 4).join(" · ")) + "</small></span>" +
          '<span class="usage"><strong>' + dsNames.length + '</strong><small>个数据集</small></span>' +
          "</button>";
      }).join("") : '<div class="eval-empty">没有匹配的论文</div>';
      list.querySelectorAll("[data-paper]").forEach(function (btn) {
        btn.addEventListener("click", function () { openPaperEvalDetail(this.dataset.paper); highlightCard(btn); });
      });
    }
  }

  function highlightCard(btn) {
    document.querySelectorAll("#evalList .eval-card").forEach(function (c) { c.classList.toggle("is-active", c === btn); });
  }

  function usageField(label, value) {
    return '<div class="usage-field"><span>' + escapeHtml(label) + "</span><p>" + renderInline(value || "—") + "</p></div>";
  }

  function openEvalPanel() {
    sidePanelEval.hidden = false;
    document.getElementById("evalWorkspace").classList.remove("no-panel");
  }

  function openDatasetDetail(datasetId) {
    var dataset = datasetById(datasetId);
    if (!dataset) return;
    openEvalEntity = { type: "dataset", id: datasetId };
    openEvalPanel();
    var recs = linksForDataset(datasetId).filter(function (r) { return natureMatches(r.nature); });
    var paperIds = Array.from(new Set(recs.map(function (r) { return r.paperId; }).filter(Boolean)));
    sidePanelEval.innerHTML =
      '<button class="panel-close" data-close-eval-panel title="关闭">×</button>' +
      '<div class="detail-header">' +
      '<span class="year-badge">' + escapeHtml(dataset.id) + " · " + escapeHtml(dataset.categoryTitle) + "</span>" +
      "<h3>" + escapeHtml(dataset.name) + "</h3>" +
      '<p class="full-title">' + escapeHtml(dataset.description || "") + "</p>" +
      "</div>" +
      '<div class="usage-summary"><div><strong>' + paperIds.length + '</strong><small>篇论文</small></div><div><strong>' + recs.length + '</strong><small>条评价用法</small></div></div>' +
      recs.map(function (r) {
        var paper = r.paperId ? paperById(r.paperId) : null;
        return '<div class="usage-card"><header>' +
          '<button class="usage-link" data-open-eval-paper="' + escapeHtml(r.paperId || "") + '"' + (!r.paperId ? " disabled" : "") + ">" + escapeHtml(r.paperName) + "</button>" +
          '<span class="nature-badge ' + (r.nature === "主观" ? "subjective" : "objective") + '">' + escapeHtml(r.nature || "—") + "</span>" +
          "</header>" +
          usageField("实验设置", r.setting) + usageField("评价指标", r.metric) + usageField("判定依据", r.basis) + usageField("评分器", r.scorer) +
          (paper ? '<button class="usage-link" style="margin-top:6px" data-open-graph-paper="' + paper.id + '">查看论文关系 →</button>' : "") +
          "</div>";
      }).join("");
    bindDetailLinks(sidePanelEval);
  }

  function openPaperEvalDetail(paperId) {
    var paper = paperById(paperId);
    if (!paper) return;
    openEvalEntity = { type: "paper", id: paperId };
    openEvalPanel();
    var uses = linksForPaper(paperId).filter(function (u) { return natureMatches(u.nature); });
    var dsCount = new Set(uses.map(function (u) { return u.datasetId; })).size;
    sidePanelEval.innerHTML =
      '<button class="panel-close" data-close-eval-panel title="关闭">×</button>' +
      '<div class="detail-header">' +
      '<span class="year-badge">' + paper.year + "</span>" +
      "<h3>" + escapeHtml(paper.name) + "</h3>" +
      '<p class="full-title">' + escapeHtml(paper.title) + "</p>" +
      "</div>" +
      '<button class="usage-link" data-open-graph-paper="' + paper.id + '" style="margin-bottom:10px">查看论文关系 →</button>' +
      '<div class="usage-summary"><div><strong>' + dsCount + '</strong><small>个数据集</small></div><div><strong>' + uses.length + '</strong><small>条评价用法</small></div></div>' +
      uses.map(function (u) {
        var dataset = datasetById(u.datasetId);
        return '<div class="usage-card"><header>' +
          '<button class="usage-link" data-open-eval-dataset="' + escapeHtml(u.datasetId) + '">' + escapeHtml(dataset ? dataset.name : u.datasetId) + "</button>" +
          '<span class="nature-badge ' + (u.nature === "主观" ? "subjective" : "objective") + '">' + escapeHtml(u.nature || "—") + "</span>" +
          "</header>" +
          usageField("实验设置", u.setting) + usageField("评价指标", u.metric) + usageField("判定依据", u.basis) + usageField("评分器", u.scorer) +
          "</div>";
      }).join("");
    bindDetailLinks(sidePanelEval);
  }

  function bindDetailLinks(root) {
    root.querySelectorAll("[data-open-eval-paper]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = this.dataset.openEvalPaper;
        if (!id) return;
        selectPerspective("paper");
        openPaperEvalDetail(id);
      });
    });
    root.querySelectorAll("[data-open-eval-dataset]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        selectPerspective("dataset");
        openDatasetDetail(this.dataset.openEvalDataset);
      });
    });
    root.querySelectorAll("[data-open-graph-paper]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelector('.view-tab[data-view="graph"]').click();
        graphApi && graphApi.selectPaper(this.dataset.openGraphPaper);
      });
    });
    var closeBtn = root.querySelector("[data-close-eval-panel]");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        sidePanelEval.hidden = true;
        sidePanelEval.innerHTML = "";
        openEvalEntity = null;
        document.getElementById("evalWorkspace").classList.add("no-panel");
      });
    }
  }
})();
