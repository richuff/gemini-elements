/**
 * periodic_ui.js — 亮色高科技元素周期表模型选择器 (紧凑不超屏版)
 *
 * 彻底解决原生窗口在左上方弹出的问题：
 *   1. 打开模态框时绝不调用原生触发器的 click()，仅展开自定义模态框。
 *   2. 原生选择器通过透明度与尺寸收缩隐藏，杜绝 (0,0) 定位异常。
 *   3. 真实模型静态预置与动态感知：Neon(氖)、Carbon(碳)、Argon(氩)、Hydrogen(氢)按全称精准映射入周期表对应格。
 *   4. 最下方为“其他模型”专属区域（Gemini 3.8 Flash、Claude Sonnet/Opus、GPT-OSS）。
 *   5. 点击模型时完全静默切换，绝不闪烁原生菜单。
 */

(function () {
  // 清除旧版本任何残留 DOM 与观察器
  if (window.__agyElementsObserver) {
    try { window.__agyElementsObserver.disconnect(); } catch (e) {}
  }

  ['agy-elements-trigger-btn', 'agy-custom-model-trigger', 'agy-elements-modal-overlay', 'agy-model-modal-overlay', 'agy-periodic-modal-overlay',
   'agy-elements-styles', 'agy-model-elements-styles', 'agy-light-periodic-styles', 'agy-model-toast', 'agy-effort-popover'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });

  // 118 化学元素标准全库 (周期 1~7)
  const PERIODIC_TABLE = [
    // 周期 1
    { z: 1, s: 'H', zh: '氢', en: 'Hydrogen', p: 1, g: 1, cat: 'nonmetal' },
    { z: 2, s: 'He', zh: '氦', en: 'Helium', p: 1, g: 18, cat: 'noble' },

    // 周期 2
    { z: 3, s: 'Li', zh: '锂', en: 'Lithium', p: 2, g: 1, cat: 'alkali' },
    { z: 4, s: 'Be', zh: '铍', en: 'Beryllium', p: 2, g: 2, cat: 'alkaline' },
    { z: 5, s: 'B', zh: '硼', en: 'Boron', p: 2, g: 13, cat: 'metalloid' },
    { z: 6, s: 'C', zh: '碳', en: 'Carbon', p: 2, g: 14, cat: 'nonmetal' },
    { z: 7, s: 'N', zh: '氮', en: 'Nitrogen', p: 2, g: 15, cat: 'nonmetal' },
    { z: 8, s: 'O', zh: '氧', en: 'Oxygen', p: 2, g: 16, cat: 'nonmetal' },
    { z: 9, s: 'F', zh: '氟', en: 'Fluorine', p: 2, g: 17, cat: 'halogen' },
    { z: 10, s: 'Ne', zh: '氖', en: 'Neon', p: 2, g: 18, cat: 'noble' },

    // 周期 3
    { z: 11, s: 'Na', zh: '钠', en: 'Sodium', p: 3, g: 1, cat: 'alkali' },
    { z: 12, s: 'Mg', zh: '镁', en: 'Magnesium', p: 3, g: 2, cat: 'alkaline' },
    { z: 13, s: 'Al', zh: '铝', en: 'Aluminium', p: 3, g: 13, cat: 'post-transition' },
    { z: 14, s: 'Si', zh: '硅', en: 'Silicon', p: 3, g: 14, cat: 'metalloid' },
    { z: 15, s: 'P', zh: '磷', en: 'Phosphorus', p: 3, g: 15, cat: 'nonmetal' },
    { z: 16, s: 'S', zh: '硫', en: 'Sulfur', p: 3, g: 16, cat: 'nonmetal' },
    { z: 17, s: 'Cl', zh: '氯', en: 'Chlorine', p: 3, g: 17, cat: 'halogen' },
    { z: 18, s: 'Ar', zh: '氩', en: 'Argon', p: 3, g: 18, cat: 'noble' },

    // 周期 4
    { z: 19, s: 'K', zh: '钾', en: 'Potassium', p: 4, g: 1, cat: 'alkali' },
    { z: 20, s: 'Ca', zh: '钙', en: 'Calcium', p: 4, g: 2, cat: 'alkaline' },
    { z: 21, s: 'Sc', zh: '钪', en: 'Scandium', p: 4, g: 3, cat: 'transition' },
    { z: 22, s: 'Ti', zh: '钛', en: 'Titanium', p: 4, g: 4, cat: 'transition' },
    { z: 23, s: 'V', zh: '钒', en: 'Vanadium', p: 4, g: 5, cat: 'transition' },
    { z: 24, s: 'Cr', zh: '铬', en: 'Chromium', p: 4, g: 6, cat: 'transition' },
    { z: 25, s: 'Mn', zh: '锰', en: 'Manganese', p: 4, g: 7, cat: 'transition' },
    { z: 26, s: 'Fe', zh: '铁', en: 'Iron', p: 4, g: 8, cat: 'transition' },
    { z: 27, s: 'Co', zh: '钴', en: 'Cobalt', p: 4, g: 9, cat: 'transition' },
    { z: 28, s: 'Ni', zh: '镍', en: 'Nickel', p: 4, g: 10, cat: 'transition' },
    { z: 29, s: 'Cu', zh: '铜', en: 'Copper', p: 4, g: 11, cat: 'transition' },
    { z: 30, s: 'Zn', zh: '锌', en: 'Zinc', p: 4, g: 12, cat: 'transition' },
    { z: 31, s: 'Ga', zh: '镓', en: 'Gallium', p: 4, g: 13, cat: 'post-transition' },
    { z: 32, s: 'Ge', zh: '锗', en: 'Germanium', p: 4, g: 14, cat: 'metalloid' },
    { z: 33, s: 'As', zh: '砷', en: 'Arsenic', p: 4, g: 15, cat: 'metalloid' },
    { z: 34, s: 'Se', zh: '硒', en: 'Selenium', p: 4, g: 16, cat: 'nonmetal' },
    { z: 35, s: 'Br', zh: '溴', en: 'Bromine', p: 4, g: 17, cat: 'halogen' },
    { z: 36, s: 'Kr', zh: '氪', en: 'Krypton', p: 4, g: 18, cat: 'noble' },

    // 周期 5
    { z: 37, s: 'Rb', zh: '铷', en: 'Rubidium', p: 5, g: 1, cat: 'alkali' },
    { z: 38, s: 'Sr', zh: '锶', en: 'Strontium', p: 5, g: 2, cat: 'alkaline' },
    { z: 39, s: 'Y', zh: '钇', en: 'Yttrium', p: 5, g: 3, cat: 'transition' },
    { z: 40, s: 'Zr', zh: '锆', en: 'Zirconium', p: 5, g: 4, cat: 'transition' },
    { z: 41, s: 'Nb', zh: '铌', en: 'Niobium', p: 5, g: 5, cat: 'transition' },
    { z: 42, s: 'Mo', zh: '钼', en: 'Molybdenum', p: 5, g: 6, cat: 'transition' },
    { z: 43, s: 'Tc', zh: '锝', en: 'Technetium', p: 5, g: 7, cat: 'transition' },
    { z: 44, s: 'Ru', zh: '钌', en: 'Ruthenium', p: 5, g: 8, cat: 'transition' },
    { z: 45, s: 'Rh', zh: '铑', en: 'Rhodium', p: 5, g: 9, cat: 'transition' },
    { z: 46, s: 'Pd', zh: '钯', en: 'Palladium', p: 5, g: 10, cat: 'transition' },
    { z: 47, s: 'Ag', zh: '银', en: 'Silver', p: 5, g: 11, cat: 'transition' },
    { z: 48, s: 'Cd', zh: '镉', en: 'Cadmium', p: 5, g: 12, cat: 'transition' },
    { z: 49, s: 'In', zh: '铟', en: 'Indium', p: 5, g: 13, cat: 'post-transition' },
    { z: 50, s: 'Sn', zh: '锡', en: 'Tin', p: 5, g: 14, cat: 'post-transition' },
    { z: 51, s: 'Sb', zh: '锑', en: 'Antimony', p: 5, g: 15, cat: 'metalloid' },
    { z: 52, s: 'Te', zh: '碲', en: 'Tellurium', p: 5, g: 16, cat: 'metalloid' },
    { z: 53, s: 'I', zh: '碘', en: 'Iodine', p: 5, g: 17, cat: 'halogen' },
    { z: 54, s: 'Xe', zh: '氙', en: 'Xenon', p: 5, g: 18, cat: 'noble' },

    // 周期 6
    { z: 55, s: 'Cs', zh: '铯', en: 'Caesium', p: 6, g: 1, cat: 'alkali' },
    { z: 56, s: 'Ba', zh: '钡', en: 'Barium', p: 6, g: 2, cat: 'alkaline' },
    { z: 57, s: 'La*', zh: '镧系', en: 'Lanthanides', p: 6, g: 3, cat: 'lanthanide' },
    { z: 72, s: 'Hf', zh: '铪', en: 'Hafnium', p: 6, g: 4, cat: 'transition' },
    { z: 73, s: 'Ta', zh: '钽', en: 'Tantalum', p: 6, g: 5, cat: 'transition' },
    { z: 74, s: 'W', zh: '钨', en: 'Tungsten', p: 6, g: 6, cat: 'transition' },
    { z: 75, s: 'Re', zh: '铼', en: 'Rhenium', p: 6, g: 7, cat: 'transition' },
    { z: 76, s: 'Os', zh: '锇', en: 'Osmium', p: 6, g: 8, cat: 'transition' },
    { z: 77, s: 'Ir', zh: '铱', en: 'Iridium', p: 6, g: 9, cat: 'transition' },
    { z: 78, s: 'Pt', zh: '铂', en: 'Platinum', p: 6, g: 10, cat: 'transition' },
    { z: 79, s: 'Au', zh: '金', en: 'Gold', p: 6, g: 11, cat: 'transition' },
    { z: 80, s: 'Hg', zh: '汞', en: 'Mercury', p: 6, g: 12, cat: 'transition' },
    { z: 81, s: 'Tl', zh: '铊', en: 'Thallium', p: 6, g: 13, cat: 'post-transition' },
    { z: 82, s: 'Pb', zh: '铅', en: 'Lead', p: 6, g: 14, cat: 'post-transition' },
    { z: 83, s: 'Bi', zh: '铋', en: 'Bismuth', p: 6, g: 15, cat: 'post-transition' },
    { z: 84, s: 'Po', zh: '钋', en: 'Polonium', p: 6, g: 16, cat: 'post-transition' },
    { z: 85, s: 'At', zh: '砹', en: 'Astatine', p: 6, g: 17, cat: 'halogen' },
    { z: 86, s: 'Rn', zh: '氡', en: 'Radon', p: 6, g: 18, cat: 'noble' },

    // 周期 7
    { z: 87, s: 'Fr', zh: '钫', en: 'Francium', p: 7, g: 1, cat: 'alkali' },
    { z: 88, s: 'Ra', zh: '镭', en: 'Radium', p: 7, g: 2, cat: 'alkaline' },
    { z: 89, s: 'Ac*', zh: '锕系', en: 'Actinides', p: 7, g: 3, cat: 'actinide' },
    { z: 104, s: 'Rf', zh: '𬬻', en: 'Rutherfordium', p: 7, g: 4, cat: 'transition' },
    { z: 105, s: 'Db', zh: '𬭊', en: 'Dubnium', p: 7, g: 5, cat: 'transition' },
    { z: 106, s: 'Sg', zh: '𬭳', en: 'Seaborgium', p: 7, g: 6, cat: 'transition' },
    { z: 107, s: 'Bh', zh: '𬭛', en: 'Bohrium', p: 7, g: 7, cat: 'transition' },
    { z: 108, s: 'Hs', zh: '𬭶', en: 'Hassium', p: 7, g: 8, cat: 'transition' },
    { z: 109, s: 'Mt', zh: '𬭵', en: 'Meitnerium', p: 7, g: 9, cat: 'transition' },
    { z: 110, s: 'Ds', zh: '𬭝', en: 'Darmstadtium', p: 7, g: 10, cat: 'transition' },
    { z: 111, s: 'Rg', zh: '𬭑', en: 'Roentgenium', p: 7, g: 11, cat: 'transition' },
    { z: 112, s: 'Cn', zh: '鎶', en: 'Copernicium', p: 7, g: 12, cat: 'transition' },
    { z: 113, s: 'Nh', zh: '鉨', en: 'Nihonium', p: 7, g: 13, cat: 'post-transition' },
    { z: 114, s: 'Fl', zh: '鈇', en: 'Flerovium', p: 7, g: 14, cat: 'post-transition' },
    { z: 115, s: 'Mc', zh: '镆', en: 'Moscovium', p: 7, g: 15, cat: 'post-transition' },
    { z: 116, s: 'Lv', zh: '𫟷', en: 'Livermorium', p: 7, g: 16, cat: 'post-transition' },
    { z: 117, s: 'Ts', zh: '鿬', en: 'Tennessine', p: 7, g: 17, cat: 'halogen' },
    { z: 118, s: 'Og', zh: '鿫', en: 'Oganesson', p: 7, g: 18, cat: 'noble' }
  ];

  // 接口中确切存在的 8 个真实模型定义（零虚构）
  const KNOWN_INTERFACE_MODELS = [
    { label: 'Gemini 4 Neon', available: false, elemEn: 'neon', elemZh: '氖' },
    { label: 'Gemini 4 Carbon', available: false, elemEn: 'carbon', elemZh: '碳' },
    { label: 'Gemini 4 Argon', available: false, elemEn: 'argon', elemZh: '氩' },
    { label: 'Gemini 4 Hydrogen', available: false, elemEn: 'hydrogen', elemZh: '氢' },
    { label: 'Gemini 3.8 Flash', available: true, isOther: true, hasEffort: true },
    { label: 'Claude Sonnet 4.6 (Thinking)', available: true, isOther: true },
    { label: 'Claude Opus 4.6 (Thinking)', available: true, isOther: true },
    { label: 'GPT-OSS 120B (Medium)', available: true, isOther: true }
  ];

  let currentModelName = '默认模型';
  let matchedElementsMap = new Map(); // z -> modelInfo
  let otherModelsList = [];

  // 获取当前活跃模型文本
  function getCurrentActiveModel() {
    const nativeTrigger = document.querySelector('button[data-testid="model-selector-trigger"]');
    if (nativeTrigger) {
      const text = nativeTrigger.innerText.trim().replace(/\s+/g, ' ');
      currentModelName = text || '默认模型';
    }
    return currentModelName;
  }

  // 计算元素与模型全称对应映射
  function initModelMappings() {
    matchedElementsMap.clear();
    const other = [];

    KNOWN_INTERFACE_MODELS.forEach(m => {
      if (m.isOther) {
        other.push(m);
        return;
      }
      // 按英文全称精确匹配到周期表元素
      const elem = PERIODIC_TABLE.find(e => e.en.toLowerCase() === m.elemEn.toLowerCase() || e.zh === m.elemZh);
      if (elem) {
        matchedElementsMap.set(elem.z, m);
      } else {
        other.push(m);
      }
    });

    otherModelsList = other;
  }

  // 模拟完整指针与点击事件（完美适配 React / Radix 内部事件监听）
  function simulateFullClick(el) {
    if (!el) return;
    const opts = { bubbles: true, cancelable: true, view: window };
    el.dispatchEvent(new PointerEvent('pointerdown', opts));
    el.dispatchEvent(new MouseEvent('mousedown', opts));
    el.dispatchEvent(new PointerEvent('pointerup', opts));
    el.dispatchEvent(new MouseEvent('mouseup', opts));
    el.click();
  }

  // 静默执行模型切换（彻底屏蔽原生菜单弹出）
  window.__selectRealModel = async function (targetLabel) {
    const nativeTrigger = document.querySelector('button[data-testid="model-selector-trigger"]');
    if (!nativeTrigger) {
      showToast('❌ 未找到模型选择器', 'error');
      return false;
    }

    // 开启全局原生菜单抑制，禁止其显示在屏幕任何位置
    document.body.classList.add('agy-suppress-native-menu');

    // 临时在可视区域之外点击以触发 Base UI 菜单加载
    const oldStyle = nativeTrigger.getAttribute('style') || '';
    nativeTrigger.setAttribute('style', 'position:fixed !important; bottom:0 !important; left:0 !important; opacity:0 !important; pointer-events:none !important;');

    nativeTrigger.click();
    await new Promise(r => setTimeout(r, 120));

    const menuItems = Array.from(document.querySelectorAll('[role="menuitem"]'));
    const targetNorm = targetLabel.toLowerCase();
    const target = menuItems.find(it => {
      const label = (it.getAttribute('data-model-label') || it.getAttribute('data-model-base') || it.textContent || it.innerText || '').toLowerCase();
      if (label.includes(targetNorm)) return true;
      if (targetNorm.includes('flash') && label.includes('flash')) return true;
      if (targetNorm.includes('sonnet') && label.includes('sonnet')) return true;
      if (targetNorm.includes('opus') && label.includes('opus')) return true;
      if (targetNorm.includes('gpt-oss') && label.includes('gpt-oss')) return true;
      if (targetNorm.includes('neon') && label.includes('neon')) return true;
      if (targetNorm.includes('carbon') && label.includes('carbon')) return true;
      if (targetNorm.includes('argon') && label.includes('argon')) return true;
      if (targetNorm.includes('hydrogen') && label.includes('hydrogen')) return true;
      return false;
    });

    let success = false;
    if (!target) {
      nativeTrigger.click(); // 关闭
      showToast(`⚠️ 接口中未找到模型 [${targetLabel}]`, 'warning');
    } else {
      const isDisabled = target.hasAttribute('data-disabled') || target.getAttribute('aria-disabled') === 'true' || target.innerText.includes('Unavailable');
      if (isDisabled) {
        nativeTrigger.click(); // 关闭
        showToast(`🔒 当前账号暂无 [${targetLabel}] 使用权限`, 'warning');
      } else {
        simulateFullClick(target);
        success = true;
        currentModelName = targetLabel;
        updateTriggerButton();
        showToast(`⚡ 已成功切换模型至：${targetLabel}`, 'success');
      }
    }

    // 稍等以确保关闭完成再恢复
    await new Promise(r => setTimeout(r, 60));
    nativeTrigger.setAttribute('style', oldStyle);
    document.body.classList.remove('agy-suppress-native-menu');

    // 关闭我们的模态框并刷新按钮显示
    closeModal();
    setTimeout(() => {
      getCurrentActiveModel();
      updateTriggerButton();
    }, 350);

    return success;
  };

  // 带有思考能级（Low / Medium / High）的模型切换
  window.__selectModelWithEffort = async function (modelBase, effortTier) {
    const nativeTrigger = document.querySelector('button[data-testid="model-selector-trigger"]');
    if (!nativeTrigger) {
      showToast('❌ 未找到模型选择器', 'error');
      return false;
    }

    document.body.classList.add('agy-suppress-native-menu');
    const oldStyle = nativeTrigger.getAttribute('style') || '';
    nativeTrigger.setAttribute('style', 'position:fixed !important; bottom:0 !important; left:0 !important; opacity:0 !important; pointer-events:none !important;');

    nativeTrigger.click();
    await new Promise(r => setTimeout(r, 180));

    const effortGroup = document.querySelector('[data-testid="model-selector-effort-group"]')?.closest('[role="menuitem"]');
    let success = false;
    if (effortGroup) {
      effortGroup.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', code: 'ArrowRight', bubbles: true }));
      await new Promise(r => setTimeout(r, 220));

      const optSpan = document.querySelector(`[data-testid="model-selector-effort-option"][data-effort="${effortTier.toLowerCase()}"]`);
      const targetOption = optSpan?.closest('[role="menuitemradio"]') || optSpan;
      if (targetOption) {
        simulateFullClick(targetOption);
        if (optSpan && optSpan !== targetOption) simulateFullClick(optSpan);
        success = true;
        const tierCap = effortTier.charAt(0).toUpperCase() + effortTier.slice(1).toLowerCase();
        currentModelName = `${modelBase} ${tierCap}`;
        updateTriggerButton();
        showToast(`⚡ 已成功切换模型至：${modelBase} (${tierCap})`, 'success');
      }
    }

    if (!success) {
      nativeTrigger.click();
      showToast(`⚠️ 切换 [${modelBase}] 档位失败`, 'warning');
    }

    await new Promise(r => setTimeout(r, 60));
    nativeTrigger.setAttribute('style', oldStyle);
    document.body.classList.remove('agy-suppress-native-menu');

    closeModal();
    hideEffortPopover();
    setTimeout(() => {
      getCurrentActiveModel();
      updateTriggerButton();
    }, 350);

    return success;
  };

  // 方案一升级版：三档滑动轨能级激发态 (Low - Medium - High)
  const TIERS = [
    { key: 'low', name: 'Low', icon: '⚪', pct: 0, statusClass: 'tier-low' },
    { key: 'medium', name: 'Medium', icon: '🟢', pct: 50, statusClass: 'tier-medium' },
    { key: 'high', name: 'High', icon: '⚡', pct: 100, statusClass: 'tier-high' }
  ];

  let currentEffortModel = '';
  let currentTierIdx = 1;

  // 创建激发态思考能级滑块气泡
  function createEffortPopover() {
    let popover = document.getElementById('agy-effort-popover');
    if (popover) {
      popover.remove();
    }

    popover = document.createElement('div');
    popover.id = 'agy-effort-popover';
    popover.className = 'agy-effort-popover';
    popover.style.display = 'none';
    popover.innerHTML = `
      <div class="agy-popover-header">
        <div class="agy-popover-title">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          <span id="agy-effort-model-title">Gemini 3.8 Flash</span>
        </div>
        <button class="agy-popover-close" id="agy-effort-close" title="关闭">✕</button>
      </div>

      <div class="agy-slider-main-row">
        <!-- 左侧滑动区 -->
        <div class="agy-slider-track-col">
          <div class="agy-tier-track-wrapper" id="agy-tier-track-wrapper">
            <div class="agy-tier-track-base" id="agy-tier-track-base">
              <div class="agy-tier-track-fill" id="agy-tier-track-fill" style="width: 50%;"></div>
              <div class="agy-tier-node node-0" data-tier="0" title="Low"><span class="node-tick"></span></div>
              <div class="agy-tier-node node-1 is-active" data-tier="1" title="Medium"><span class="node-tick"></span></div>
              <div class="agy-tier-node node-2" data-tier="2" title="High"><span class="node-tick"></span></div>
              <div class="agy-tier-thumb" id="agy-tier-thumb" style="left: 50%;" tabindex="0" role="slider">
                <div class="agy-thumb-core"></div>
              </div>
            </div>
          </div>
          <div class="agy-tier-ticks">
            <span class="tick-label label-0" data-tier="0">Low</span>
            <span class="tick-label label-1 is-active" data-tier="1">Medium</span>
            <span class="tick-label label-2" data-tier="2">High</span>
          </div>
        </div>

        <!-- 右侧：当前等级指示 Badge -->
        <div class="agy-current-level-badge tier-medium" id="agy-tier-badge">
          <span class="badge-icon" id="agy-badge-icon">🟢</span>
          <span class="badge-text" id="agy-badge-text">Medium</span>
        </div>
      </div>
    `;
    document.body.appendChild(popover);

    // 绑定关闭按钮
    document.getElementById('agy-effort-close').onclick = (e) => {
      e.stopPropagation();
      hideEffortPopover();
    };

    // 滑块核心交互：拖拽与自动吸附匹配
    const thumb = document.getElementById('agy-tier-thumb');
    const trackBase = document.getElementById('agy-tier-track-base');
    const trackFill = document.getElementById('agy-tier-track-fill');
    const trackWrapper = document.getElementById('agy-tier-track-wrapper');
    const badge = document.getElementById('agy-tier-badge');
    const badgeIcon = document.getElementById('agy-badge-icon');
    const badgeText = document.getElementById('agy-badge-text');

    let isDragging = false;
    let dragPointerId = null;

    function applyTierUI(idx) {
      currentTierIdx = idx;
      const tier = TIERS[idx];
      thumb.style.left = `${tier.pct}%`;
      trackFill.style.width = `${tier.pct}%`;

      badge.className = `agy-current-level-badge ${tier.statusClass}`;
      badgeIcon.textContent = tier.icon;
      badgeText.textContent = tier.name;

      popover.querySelectorAll('.agy-tier-node').forEach((node) => {
        const nIdx = parseInt(node.getAttribute('data-tier'), 10);
        if (nIdx === idx) node.classList.add('is-active');
        else node.classList.remove('is-active');
      });

      popover.querySelectorAll('.tick-label').forEach((label) => {
        const lIdx = parseInt(label.getAttribute('data-tier'), 10);
        if (lIdx === idx) label.classList.add('is-active');
        else label.classList.remove('is-active');
      });
    }

    function snapToTier(targetIdx, triggerChange = true) {
      thumb.style.transition = 'left 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)';
      trackFill.style.transition = 'width 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)';
      applyTierUI(targetIdx);

      if (triggerChange && currentEffortModel) {
        setTimeout(() => {
          window.__selectModelWithEffort(currentEffortModel, TIERS[targetIdx].key);
        }, 180);
      }
    }
    popover.__snapToTier = snapToTier;

    // 点击刻度节点或标签，直接平滑吸附并切换
    popover.querySelectorAll('.agy-tier-node, .tick-label').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(el.getAttribute('data-tier'), 10);
        if (!isNaN(idx)) {
          snapToTier(idx, true);
        }
      });
    });

    // 轨道拖拽与松开自动匹配下级档位
    function onPointerDown(e) {
      e.stopPropagation();
      isDragging = true;
      dragPointerId = e.pointerId;
      try {
        thumb.setPointerCapture(e.pointerId);
      } catch (_) {}
      thumb.classList.add('is-dragging');

      thumb.style.transition = 'none';
      trackFill.style.transition = 'none';
      handleMove(e);
    }

    function handleMove(e) {
      if (!isDragging) return;
      const rect = trackBase.getBoundingClientRect();
      const rawPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));

      thumb.style.left = `${rawPct}%`;
      trackFill.style.width = `${rawPct}%`;

      // 实时预显当前右侧等级指示
      let previewIdx = 0;
      if (rawPct >= 85) previewIdx = 2;
      else if (rawPct >= 38) previewIdx = 1;
      else previewIdx = 0;

      const pTier = TIERS[previewIdx];
      badge.className = `agy-current-level-badge ${pTier.statusClass}`;
      badgeIcon.textContent = pTier.icon;
      badgeText.textContent = pTier.name;

      popover.querySelectorAll('.tick-label').forEach((label) => {
        const lIdx = parseInt(label.getAttribute('data-tier'), 10);
        if (lIdx === previewIdx) label.classList.add('is-active');
        else label.classList.remove('is-active');
      });
    }

    function onPointerUp(e) {
      if (!isDragging) return;
      isDragging = false;
      thumb.classList.remove('is-dragging');
      try {
        thumb.releasePointerCapture(e.pointerId);
      } catch (_) {}

      const rect = trackBase.getBoundingClientRect();
      const rawPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));

      // 松开自动匹配档位规则（未完全达标则自动回弹至下级档位）：
      // 0% ~ 45% -> 匹配到 Low (0)
      // 45% ~ 88% -> 匹配到 Medium (1)
      // >= 88% -> 匹配到 High (2)
      let snapIdx = 0;
      if (rawPct >= 88) snapIdx = 2;
      else if (rawPct >= 45) snapIdx = 1;
      else snapIdx = 0;

      snapToTier(snapIdx, true);
    }

    thumb.addEventListener('pointerdown', onPointerDown);
    thumb.addEventListener('pointermove', handleMove);
    thumb.addEventListener('pointerup', onPointerUp);
    thumb.addEventListener('pointercancel', onPointerUp);

    // 点击轨道空白处也可以直接吸附
    trackWrapper.addEventListener('click', (e) => {
      if (e.target === thumb || thumb.contains(e.target)) return;
      e.stopPropagation();
      const rect = trackBase.getBoundingClientRect();
      const clickPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      let clickIdx = 0;
      if (clickPct >= 75) clickIdx = 2;
      else if (clickPct >= 25) clickIdx = 1;
      else clickIdx = 0;
      snapToTier(clickIdx, true);
    });

    return popover;
  }

  function showEffortPopover(anchorEl, modelName) {
    const popover = createEffortPopover();
    currentEffortModel = modelName;
    document.getElementById('agy-effort-model-title').textContent = modelName;

    const rect = anchorEl.getBoundingClientRect();
    popover.style.left = `${rect.left + rect.width / 2}px`;
    popover.style.top = `${rect.top - 14}px`;
    popover.style.display = 'flex';

    const normCurrent = currentModelName.toLowerCase();
    let initialTierIdx = 1; // 默认 medium
    if (normCurrent.includes('low')) initialTierIdx = 0;
    else if (normCurrent.includes('high')) initialTierIdx = 2;
    else initialTierIdx = 1;

    if (popover.__snapToTier) {
      popover.__snapToTier(initialTierIdx, false);
    }
  }

  function hideEffortPopover() {
    const popover = document.getElementById('agy-effort-popover');
    if (popover) popover.style.display = 'none';
  }

  // Toast 提示条
  function showToast(msg, type = 'info') {
    let toast = document.getElementById('agy-model-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'agy-model-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = `agy-model-toast agy-toast-${type} show`;
    clearTimeout(toast.__t);
    toast.__t = setTimeout(() => {
      toast.classList.remove('show');
    }, 2600);
  }

  // 注入亮色紧凑样式
  function injectStyles() {
    const oldStyle = document.getElementById('agy-light-periodic-styles');
    if (oldStyle) oldStyle.remove();
    const style = document.createElement('style');
    style.id = 'agy-light-periodic-styles';
    style.textContent = `
      /* 隐藏原生选择器，采用精确定位尺寸收缩，杜绝 (0,0) 左上角异常 */
      button[data-testid="model-selector-trigger"] {
        position: absolute !important;
        opacity: 0 !important;
        pointer-events: none !important;
        width: 1px !important;
        height: 1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
      }
      #agy-elements-trigger-btn {
        display: none !important;
      }

      /* 抑制原生官方弹出菜单，杜绝在屏幕任何角落（尤其左上角）闪烁 */
      body.agy-suppress-native-menu [role="menu"],
      body.agy-suppress-native-menu [data-radix-popper-content-wrapper],
      body.agy-suppress-native-menu [data-floating-ui-portal] {
        position: fixed !important;
        top: -9999px !important;
        left: -9999px !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }

      /* 统一触发按钮（以当前模型命名） */
      .agy-unified-model-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 28px;
        padding: 0 10px 0 6px;
        border-radius: 9999px;
        background: #ffffff;
        border: 1px solid #cbd5e1;
        color: #0f172a;
        font-size: 12.5px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        user-select: none;
        outline: none;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      }
      .agy-unified-model-btn:hover {
        background: #f8fafc;
        border-color: #0284c7;
        box-shadow: 0 0 10px rgba(2, 132, 199, 0.25);
        color: #0369a1;
      }
      .agy-unified-model-btn .elem-badge {
        font-size: 10px;
        font-weight: 800;
        padding: 1px 5px;
        border-radius: 5px;
        background: linear-gradient(135deg, #0ea5e9, #38bdf8);
        color: #ffffff;
      }
      .agy-unified-model-btn .model-label-text {
        max-width: 220px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* 模态浮窗（全景亮色高质感 HUD，紧凑自适应居中） */
      #agy-periodic-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.45);
        backdrop-filter: blur(8px);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      #agy-periodic-modal-overlay.active {
        opacity: 1;
        pointer-events: auto;
      }
      .agy-periodic-dialog {
        width: 96vw;
        max-width: 1580px;
        max-height: 92vh;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        box-shadow: 0 25px 60px rgba(15, 23, 42, 0.22), 0 0 35px rgba(14, 165, 233, 0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #0f172a;
        transform: scale(0.92) translateY(24px);
        opacity: 0;
        transition: transform 0.32s cubic-bezier(0.34, 1.45, 0.64, 1), opacity 0.25s ease;
      }
      #agy-periodic-modal-overlay.active .agy-periodic-dialog {
        transform: scale(1) translateY(0);
        opacity: 1;
      }

      /* 顶栏 */
      .agy-p-header {
        padding: 14px 26px;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
      }
      .agy-p-header-title {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .agy-p-header-title h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        color: #0f172a;
      }
      .agy-p-header-title span {
        font-size: 14px;
        color: #64748b;
      }
      .agy-p-close {
        background: transparent;
        border: none;
        color: #64748b;
        font-size: 22px;
        cursor: pointer;
        padding: 4px 10px;
        border-radius: 8px;
        transition: all 0.15s;
      }
      .agy-p-close:hover {
        background: #fee2e2;
        color: #ef4444;
      }

      /* 周期表网格滚动区（大屏宽景 HUD 视图） */
      .agy-p-body {
        padding: 14px 22px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 14px;
        background: #fafafa;
      }
      .agy-periodic-grid {
        display: grid;
        grid-template-columns: repeat(18, minmax(0, 1fr));
        gap: 5px;
        width: 100%;
      }

      /* 单个元素格子（再放大 20%，触控舒适度与观感极佳） */
      .agy-elem-cell {
        aspect-ratio: 1 / 1.05;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 7px;
        padding: 3.5px 4px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
        user-select: none;
        box-shadow: 0 1px 2px rgba(0,0,0,0.02);
      }
      .agy-elem-cell:not(.empty):hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
        z-index: 5;
      }
      .agy-elem-cell:not(.empty):active {
        transform: scale(0.95);
        transition-duration: 0.08s;
      }
      .agy-elem-cell.empty {
        background: transparent;
        border: none;
        box-shadow: none;
        pointer-events: none;
      }
      .agy-elem-cell .z-num {
        font-size: 10.5px;
        color: #94a3b8;
        font-family: monospace;
        line-height: 1;
      }
      .agy-elem-cell .symbol {
        font-size: 20.5px;
        font-weight: 800;
        text-align: center;
        color: #334155;
        line-height: 1.1;
      }
      .agy-elem-cell .zh-name {
        font-size: 13px;
        font-weight: 500;
        text-align: center;
        color: #64748b;
        line-height: 1.1;
        white-space: nowrap;
        overflow: hidden;
      }

      /* 亮色核心效果：开放的 Gemini 4 元素模型【强烈发光亮起并标记可选】 */
      .agy-elem-cell.is-available {
        cursor: pointer;
        background: #ecfeff !important;
        border: 1.5px solid #06b6d4 !important;
        box-shadow: 0 0 10px rgba(6, 182, 212, 0.55), inset 0 0 6px rgba(16, 185, 129, 0.25) !important;
        animation: light-glow-breathe 2.2s infinite alternate ease-in-out;
      }
      .agy-elem-cell.is-available .symbol {
        color: #0891b2 !important;
        text-shadow: 0 0 4px rgba(6, 182, 212, 0.4);
      }
      .agy-elem-cell.is-available:hover {
        transform: translateY(-4px) scale(1.1);
        border-color: #0284c7 !important;
        box-shadow: 0 0 20px rgba(2, 132, 199, 0.85) !important;
        z-index: 10;
      }
      .agy-elem-cell.is-available:active {
        transform: scale(0.98);
        box-shadow: 0 0 12px rgba(2, 132, 199, 0.7) !important;
      }
      .agy-elem-cell.is-available::after {
        content: "可选";
        position: absolute;
        top: 2px;
        right: 2px;
        font-size: 8.5px;
        padding: 1px 3.5px;
        background: #10b981;
        color: #ffffff;
        border-radius: 3px;
        font-weight: 700;
      }
      @keyframes light-glow-breathe {
        from { box-shadow: 0 0 5px rgba(6, 182, 212, 0.4); }
        to { box-shadow: 0 0 12px rgba(6, 182, 212, 0.85); }
      }

      /* 当前选定的模型 */
      .agy-elem-cell.is-current {
        border: 2px solid #eab308 !important;
        background: #fefce8 !important;
        box-shadow: 0 0 12px rgba(234, 179, 8, 0.6) !important;
      }
      .agy-elem-cell.is-current::after {
        content: "当前";
        position: absolute;
        top: 2px;
        right: 2px;
        font-size: 8.5px;
        padding: 1px 3.5px;
        border-radius: 3px;
        font-weight: 700;
        background: #eab308;
        color: #0f172a;
      }

      /* 接口中已发布但当前账号无权限的模型 (Neon 氖, Carbon 碳, Argon 氩, Hydrogen 氢) */
      .agy-elem-cell.is-unauthorized {
        border: 1px solid #fed7aa !important;
        background: #fffbeb !important;
        cursor: pointer;
      }
      .agy-elem-cell.is-unauthorized:hover {
        border-color: #f97316 !important;
        box-shadow: 0 0 8px rgba(249, 115, 22, 0.35);
        transform: translateY(-1px);
      }
      .agy-elem-cell.is-unauthorized .symbol {
        color: #ea580c;
      }
      .agy-elem-cell.is-unauthorized::after {
        content: "🔒无权限";
        position: absolute;
        top: 2px;
        right: 2px;
        font-size: 8px;
        padding: 1px 3.5px;
        background: #f97316;
        color: #ffffff;
        border-radius: 3px;
        font-weight: 600;
      }

      /* 周期表中其他未发布的元素 */
      .agy-elem-cell.is-unreleased {
        background: #ffffff;
        border: 1px solid #f1f5f9;
        cursor: pointer;
      }
      .agy-elem-cell.is-unreleased:hover {
        border-color: #cbd5e1;
        background: #f8fafc;
      }
      .agy-elem-cell.is-unreleased::after {
        content: "未发布";
        position: absolute;
        top: 2px;
        right: 2px;
        font-size: 7.5px;
        color: #94a3b8;
        padding: 1px 3px;
        border-radius: 2px;
        background: #f1f5f9;
        font-weight: 500;
      }

      /* 最下方“其他模型”独立专属区（支持默认折叠与点击展开） */
      .agy-other-models-section {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 12px 18px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        transition: all 0.2s ease;
      }
      .agy-other-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        user-select: none;
        padding: 2px 0;
      }
      .agy-other-title {
        font-size: 15px;
        font-weight: 700;
        color: #334155;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .agy-other-chevron {
        transition: transform 0.2s ease;
        transform: rotate(-90deg);
        color: #64748b;
      }
      .agy-other-models-section.is-expanded .agy-other-chevron {
        transform: rotate(0deg);
        color: #0284c7;
      }
      .agy-other-toggle-hint {
        font-size: 12.5px;
        color: #0284c7;
        font-weight: 600;
        padding: 3px 12px;
        border-radius: 6px;
        background: #f0f9ff;
        border: 1px solid #bae6fd;
        transition: all 0.15s ease;
      }
      .agy-other-header:hover .agy-other-toggle-hint {
        background: #e0f2fe;
      }
      .agy-other-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 10px;
        margin-top: 12px;
        max-height: 600px;
        opacity: 1;
        transform: translateY(0);
        overflow: hidden;
        transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.28s ease, transform 0.28s ease, margin-top 0.3s ease;
      }
      .agy-other-grid.collapsed {
        max-height: 0 !important;
        opacity: 0 !important;
        transform: translateY(-10px);
        margin-top: 0 !important;
        pointer-events: none;
      }
      .agy-other-card {
        background: #f8fafc;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        padding: 10px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .agy-other-card:hover {
        border-color: #0284c7;
        background: #f0f9ff;
        transform: translateY(-2px) scale(1.02);
      }
      .agy-other-card:active {
        transform: scale(0.97);
      }
      .agy-other-card.is-available {
        border-color: #06b6d4;
        background: #ecfeff;
        box-shadow: 0 0 8px rgba(6, 182, 212, 0.3);
      }
      .agy-other-card.is-current {
        border: 2px solid #eab308;
        background: #fefce8;
        box-shadow: 0 0 10px rgba(234, 179, 8, 0.4);
      }
      .agy-other-name {
        font-size: 14px;
        font-weight: 600;
        color: #0f172a;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .agy-other-tag {
        font-size: 11px;
        padding: 2px 7px;
        border-radius: 4px;
        font-weight: 700;
      }
      .agy-other-tag.tag-avail {
        background: #10b981;
        color: #ffffff;
      }
      .agy-other-tag.tag-current {
        background: #eab308;
        color: #0f172a;
      }

      /* 方案一升级版：紧凑三档滑动轨（右侧实时等级指示） */
      .agy-effort-popover {
        position: fixed;
        z-index: 1000005;
        background: #ffffff;
        border: 1.5px solid #0284c7;
        border-radius: 14px;
        padding: 10px 14px 12px 14px;
        box-shadow: 0 16px 40px rgba(15, 23, 42, 0.25), 0 0 25px rgba(14, 165, 233, 0.28);
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 380px;
        transform: translate(-50%, -100%);
        margin-top: -14px;
        animation: agy-pop-in 0.24s cubic-bezier(0.34, 1.56, 0.64, 1);
        pointer-events: auto;
      }
      @keyframes agy-pop-in {
        0% { opacity: 0; transform: translate(-50%, -85%) scale(0.88); }
        70% { opacity: 1; transform: translate(-50%, -102%) scale(1.03); }
        100% { opacity: 1; transform: translate(-50%, -100%) scale(1); }
      }
      .agy-effort-popover::after {
        content: "";
        position: absolute;
        bottom: -7px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
        width: 12px;
        height: 12px;
        background: #ffffff;
        border-right: 1.5px solid #0284c7;
        border-bottom: 1.5px solid #0284c7;
      }
      .agy-popover-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #f1f5f9;
        padding-bottom: 6px;
      }
      .agy-popover-title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13.5px;
        font-weight: 700;
        color: #0f172a;
      }
      .agy-popover-close {
        background: none;
        border: none;
        font-size: 14px;
        cursor: pointer;
        color: #94a3b8;
        padding: 2px 6px;
        border-radius: 4px;
        line-height: 1;
        transition: all 0.15s;
      }
      .agy-popover-close:hover {
        color: #ef4444;
        background: #fee2e2;
      }

      /* 滑动条主行：左侧轨道，右侧当前等级 Badge */
      .agy-slider-main-row {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 6px 2px 2px 2px;
      }
      .agy-slider-track-col {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .agy-tier-ticks {
        display: flex;
        justify-content: space-between;
        padding: 0 4px;
      }
      .tick-label {
        font-size: 11px;
        font-weight: 600;
        color: #94a3b8;
        cursor: pointer;
        transition: all 0.15s ease;
        user-select: none;
      }
      .tick-label:hover {
        color: #0284c7;
      }
      .tick-label.is-active {
        color: #0284c7;
        font-weight: 700;
      }
      .tick-label.label-0 { text-align: left; }
      .tick-label.label-1 { text-align: center; }
      .tick-label.label-2 { text-align: right; }

      /* 右侧当前等级 Badge */
      .agy-current-level-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-width: 95px;
        height: 34px;
        padding: 0 12px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 700;
        user-select: none;
        transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        border: 1.5px solid transparent;
        flex-shrink: 0;
      }
      .agy-current-level-badge.tier-low {
        background: #f1f5f9;
        border-color: #cbd5e1;
        color: #334155;
      }
      .agy-current-level-badge.tier-medium {
        background: #ecfdf5;
        border-color: #10b981;
        color: #047857;
        box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
      }
      .agy-current-level-badge.tier-high {
        background: #fffbeb;
        border-color: #f59e0b;
        color: #b45309;
        box-shadow: 0 0 10px rgba(245, 158, 11, 0.25);
      }
      .agy-current-level-badge .badge-icon {
        font-size: 14px;
        line-height: 1;
      }

      /* 滑动轨道容器 */
      .agy-tier-track-wrapper {
        position: relative;
        height: 28px;
        display: flex;
        align-items: center;
        padding: 0 12px;
        user-select: none;
        cursor: pointer;
      }
      .agy-tier-track-base {
        position: relative;
        width: 100%;
        height: 7px;
        background: #e2e8f0;
        border-radius: 9999px;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08);
      }
      .agy-tier-track-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        border-radius: 9999px;
        background: linear-gradient(90deg, #94a3b8 0%, #10b981 50%, #f59e0b 100%);
        transition: width 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
        pointer-events: none;
      }
      /* 吸附节点刻度 */
      .agy-tier-node {
        position: absolute;
        top: 50%;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: #ffffff;
        border: 2px solid #cbd5e1;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        z-index: 2;
        cursor: pointer;
      }
      .agy-tier-node.node-0 { left: 0%; }
      .agy-tier-node.node-1 { left: 50%; }
      .agy-tier-node.node-2 { left: 100%; }
      .agy-tier-node .node-tick {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #94a3b8;
        transition: all 0.2s ease;
      }
      .agy-tier-node.is-active {
        border-color: #0284c7;
        box-shadow: 0 0 8px rgba(2, 132, 199, 0.45);
      }
      .agy-tier-node.is-active .node-tick {
        background: #0284c7;
        transform: scale(1.3);
      }

      /* 拖拽滑块 Thumb */
      .agy-tier-thumb {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #ffffff;
        border: 2.5px solid #0284c7;
        transform: translate(-50%, -50%);
        box-shadow: 0 2px 10px rgba(2, 132, 199, 0.45), 0 0 0 3px rgba(14, 165, 233, 0.18);
        cursor: grab;
        z-index: 5;
        transition: left 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.15s ease, box-shadow 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: none;
        touch-action: none;
      }
      .agy-tier-thumb:hover {
        transform: translate(-50%, -50%) scale(1.12);
        box-shadow: 0 4px 14px rgba(2, 132, 199, 0.55), 0 0 0 5px rgba(14, 165, 233, 0.25);
      }
      .agy-tier-thumb:active,
      .agy-tier-thumb.is-dragging {
        cursor: grabbing;
        transform: translate(-50%, -50%) scale(1.18);
        box-shadow: 0 6px 18px rgba(2, 132, 199, 0.65), 0 0 0 6px rgba(14, 165, 233, 0.35);
      }
      .agy-thumb-core {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: #0284c7;
        transition: transform 0.15s ease;
      }
      .agy-tier-thumb:active .agy-thumb-core {
        transform: scale(1.2);
        background: #0369a1;
      }

      /* Toast 提示条 */
      #agy-model-toast {
        position: fixed;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: #0f172a;
        border: 1px solid #38bdf8;
        padding: 8px 16px;
        border-radius: 8px;
        color: #ffffff;
        font-size: 12.5px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        opacity: 0;
        pointer-events: none;
        transition: all 0.2s ease;
        z-index: 1000000;
      }
      #agy-model-toast.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
      #agy-model-toast.agy-toast-success { border-color: #10b981; color: #6ee7b7; }
      #agy-model-toast.agy-toast-warning { border-color: #f59e0b; color: #fde68a; }
      #agy-model-toast.agy-toast-error { border-color: #ef4444; color: #fca5a5; }
    `;
    document.head.appendChild(style);
  }

  // 更新触发按钮（以当前模型命名）
  function updateTriggerButton() {
    let btn = document.getElementById('agy-custom-model-trigger');
    const footer = document.querySelector('.agy-composer-footer');
    if (!footer) return;

    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'agy-custom-model-trigger';
      btn.type = 'button';
      btn.className = 'agy-unified-model-btn';

      const nativeTrigger = footer.querySelector('button[data-testid="model-selector-trigger"]');
      if (nativeTrigger && nativeTrigger.parentElement) {
        nativeTrigger.parentElement.parentElement.appendChild(btn);
      } else {
        footer.appendChild(btn);
      }
    }

    // 始终确保绑定最新 openModal 处理函数
    btn.onclick = openModal;

    const displayName = currentModelName || '默认模型';
    let badge = '✦';
    const l = displayName.toLowerCase();
    for (const elem of PERIODIC_TABLE) {
      if (l.includes(elem.en.toLowerCase()) || displayName.includes(elem.zh)) {
        badge = elem.s;
        break;
      }
    }

    btn.innerHTML = `
      <span class="elem-badge">${badge}</span>
      <span class="model-label-text">${displayName}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 -960 960 960" fill="currentColor" style="opacity:0.6;">
        <path d="M480-357.85L253.85-584L296-626.15l184,184l184-184L706.15-584L480-357.85Z"></path>
      </svg>
    `;
    btn.title = `当前模型：${displayName} (点击选择切换)`;
  }

  // 模态周期表窗口
  function createModal() {
    const oldModal = document.getElementById('agy-periodic-modal-overlay');
    if (oldModal) oldModal.remove();

    const overlay = document.createElement('div');
    overlay.id = 'agy-periodic-modal-overlay';
    overlay.innerHTML = `
      <div class="agy-periodic-dialog" role="dialog" aria-modal="true">
        <!-- 顶栏 -->
        <div class="agy-p-header">
          <div class="agy-p-header-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)"/>
            </svg>
            <h3>模型选择矩阵</h3>
            <span>Gemini 4 元素模型全称匹配 · 开放模型发光可选 · 底部收纳其他模型</span>
          </div>
          <button class="agy-p-close" id="agy-p-close" title="关闭 (Esc)">✕</button>
        </div>

        <!-- 周期表网格主体 -->
        <div class="agy-p-body">
          <div class="agy-periodic-grid" id="agy-p-grid"></div>

          <!-- 最下方：其他模型区域（默认折叠） -->
          <div class="agy-other-models-section" id="agy-other-section">
            <div class="agy-other-header" id="agy-other-toggle-btn" role="button" tabindex="0">
              <div class="agy-other-title">
                <svg class="agy-other-chevron" id="agy-other-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                <span>其他可用模型</span>
              </div>
              <div class="agy-other-toggle-hint" id="agy-other-hint">点击展开 (4) ▾</div>
            </div>
            <div class="agy-other-grid collapsed" id="agy-other-grid"></div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    let otherExpanded = false;
    window.__setOtherModelsExpanded = function (exp) {
      otherExpanded = !!exp;
      const otherGrid = document.getElementById('agy-other-grid');
      const otherSection = document.getElementById('agy-other-section');
      const hint = document.getElementById('agy-other-hint');
      if (!otherGrid || !otherSection || !hint) return;

      if (otherExpanded) {
        otherGrid.classList.remove('collapsed');
        otherSection.classList.add('is-expanded');
        hint.innerHTML = '点击收起 ▴';
      } else {
        otherGrid.classList.add('collapsed');
        otherSection.classList.remove('is-expanded');
        hint.innerHTML = `点击展开 (${otherModelsList.length}) ▾`;
      }
    };

    const toggleBtn = document.getElementById('agy-other-toggle-btn');
    if (toggleBtn) {
      toggleBtn.onclick = (e) => {
        e.stopPropagation();
        window.__setOtherModelsExpanded(!otherExpanded);
      };
    }

    document.getElementById('agy-p-close').onclick = closeModal;
    overlay.onclick = (e) => {
      hideEffortPopover();
      if (e.target === overlay) closeModal();
    };
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideEffortPopover();
        if (overlay.classList.contains('active')) closeModal();
      }
    });
  }

  // 渲染周期表格子与下方其他模型（完全纯净 DOM 渲染，绝不触发任何外部 API）
  function renderAll() {
    const grid = document.getElementById('agy-p-grid');
    const otherGrid = document.getElementById('agy-other-grid');
    if (!grid || !otherGrid) return;

    grid.innerHTML = '';
    otherGrid.innerHTML = '';

    const map = Array.from({ length: 7 }, () => Array(18).fill(null));
    PERIODIC_TABLE.forEach(el => {
      if (el.p >= 1 && el.p <= 7 && el.g >= 1 && el.g <= 18) {
        map[el.p - 1][el.g - 1] = el;
      }
    });

    const normCurrent = currentModelName.toLowerCase();

    // 渲染 118 周期表
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 18; c++) {
        const elem = map[r][c];
        const cell = document.createElement('div');

        if (!elem) {
          cell.className = 'agy-elem-cell empty';
          grid.appendChild(cell);
          continue;
        }

        cell.className = 'agy-elem-cell';
        const matchedModel = matchedElementsMap.get(elem.z);

        if (matchedModel) {
          const isCurrent = normCurrent.includes(matchedModel.elemEn.toLowerCase()) || 
                            normCurrent.includes(matchedModel.elemZh) ||
                            normCurrent.includes(matchedModel.label.toLowerCase());
          const isAvailable = matchedModel.available;

          if (isCurrent) {
            cell.classList.add('is-current');
            cell.title = `当前模型：${matchedModel.label}`;
          } else if (isAvailable) {
            cell.classList.add('is-available');
            cell.title = `匹配模型：${matchedModel.label} (已开放 · 点击切换)`;
          } else {
            cell.classList.add('is-unauthorized');
            cell.title = `匹配模型：${matchedModel.label} (已发布 · 当前账号暂无使用权限)`;
          }

          if (matchedModel.hasEffort) {
            cell.onclick = (e) => {
              e.stopPropagation();
              showEffortPopover(cell, matchedModel.label);
            };
          } else {
            cell.onclick = (e) => {
              e.stopPropagation();
              window.__selectRealModel(matchedModel.label);
            };
          }
        } else {
          cell.classList.add('is-unreleased');
          cell.title = `${elem.z}. ${elem.zh} (${elem.en}) · 未发布`;
          cell.onclick = (e) => {
            e.stopPropagation();
            showToast(`ℹ️ 元素 [${elem.zh} ${elem.en}] 暂未发布对应模型`, 'info');
          };
        }

        cell.innerHTML = `
          <div class="z-num">${elem.z}</div>
          <div class="symbol">${elem.s}</div>
          <div class="zh-name">${elem.zh}</div>
        `;
        grid.appendChild(cell);
      }
    }

    // 渲染最下方“其他模型”
    otherModelsList.forEach(m => {
      const card = document.createElement('div');
      const isCurrent = normCurrent.includes(m.label.toLowerCase()) || 
        (m.label.toLowerCase().includes('flash') && normCurrent.includes('flash')) ||
        (m.label.toLowerCase().includes('sonnet') && normCurrent.includes('sonnet')) ||
        (m.label.toLowerCase().includes('opus') && normCurrent.includes('opus')) ||
        (m.label.toLowerCase().includes('gpt-oss') && normCurrent.includes('gpt-oss'));
      const isAvailable = m.available;

      card.className = 'agy-other-card';
      if (isCurrent) card.classList.add('is-current');
      else if (isAvailable) card.classList.add('is-available');

      const tagText = isCurrent ? '当前' : (isAvailable ? '可选' : '待开放');
      const tagClass = isCurrent ? 'tag-current' : (isAvailable ? 'tag-avail' : '');

      card.innerHTML = `
        <span class="agy-other-name" title="${m.label}">${m.label}</span>
        <span class="agy-other-tag ${tagClass}">${tagText}</span>
      `;

      if (m.hasEffort) {
        card.onclick = (e) => {
          e.stopPropagation();
          showEffortPopover(card, m.label);
        };
      } else {
        card.onclick = (e) => {
          e.stopPropagation();
          window.__selectRealModel(m.label);
        };
      }

      otherGrid.appendChild(card);
    });
  }

  // 打开模态框（纯净打开，绝不点击原生触发器）
  function openModal(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    let overlay = document.getElementById('agy-periodic-modal-overlay');
    if (!overlay) {
      createModal();
      overlay = document.getElementById('agy-periodic-modal-overlay');
    }
    getCurrentActiveModel();
    renderAll();
    if (window.__setOtherModelsExpanded) window.__setOtherModelsExpanded(false);
    overlay.classList.add('active');
  }

  function closeModal() {
    hideEffortPopover();
    const overlay = document.getElementById('agy-periodic-modal-overlay');
    if (overlay) overlay.classList.remove('active');
  }

  // 初始化
  function init() {
    if (window.__agyElementsObserver) {
      try { window.__agyElementsObserver.disconnect(); } catch (_) {}
    }
    injectStyles();
    createModal();
    initModelMappings();
    getCurrentActiveModel();
    updateTriggerButton();
    renderAll();
    if (window.__setOtherModelsExpanded) window.__setOtherModelsExpanded(false);

    const observer = new MutationObserver(() => {
      if (!document.getElementById('agy-custom-model-trigger')) {
        updateTriggerButton();
      } else {
        const nativeTrigger = document.querySelector('button[data-testid="model-selector-trigger"]');
        if (nativeTrigger) {
          const t = (nativeTrigger.innerText || nativeTrigger.textContent || '').trim();
          if (t && t !== currentModelName) {
            currentModelName = t;
            updateTriggerButton();
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    window.__agyElementsObserver = observer;
  }

  init();
  console.log('[GeminiElements] Pure Clean Periodic Selector Initialized.');
})();
