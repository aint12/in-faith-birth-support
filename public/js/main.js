/* In Faith Birth Support — site interactions */
(function () {
  "use strict";

  /* ---- Mobile navigation toggle ---- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav__toggle");

  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close the menu when a link is tapped.
    header.querySelectorAll(".nav__links a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Sticky header shadow on scroll ---- */
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---- Current year in footer ---- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Booking / consultation form ---- */
  var form = document.querySelector("#consultation-form");
  if (form) {
    var status = form.querySelector(".form-status");
    var submitBtn = form.querySelector('button[type="submit"]');
    var defaultBtnText = submitBtn ? submitBtn.textContent : "";

    var setStatus = function (msg, type) {
      if (!status) return;
      status.textContent = msg;
      status.className = "form-status is-" + type;
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var payload = {
        name: (form.name.value || "").trim(),
        email: (form.email.value || "").trim(),
        phone: form.phone ? form.phone.value.trim() : "",
        dueDate: form.dueDate ? form.dueDate.value.trim() : "",
        service: form.service ? form.service.value.trim() : "",
        contactMethod: form.contactMethod ? form.contactMethod.value.trim() : "",
        message: form.message ? form.message.value.trim() : "",
      };

      if (!payload.name || !payload.email) {
        setStatus("Please share your name and email so we can reach you.", "error");
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data.ok) {
            form.reset();
            setStatus(
              "Thank you, " +
                payload.name.split(" ")[0] +
                "! Your request is in — we'll reach out within one business day. 🤍",
              "success"
            );
          } else {
            setStatus(
              (result.data && result.data.error) ||
                "Something went wrong. Please email us directly.",
              "error"
            );
          }
        })
        .catch(function () {
          setStatus(
            "We couldn't send that just now. Please email hello@infaithbirthsupport.com.",
            "error"
          );
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = defaultBtnText;
          }
        });
    });
  }
})();
