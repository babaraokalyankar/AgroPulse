import { Chart } from "@/components/ui/chart"
// Main JavaScript file for AgroPulse Flask Application

$(document).ready(() => {
  // Initialize tooltips
  $('[data-bs-toggle="tooltip"]').tooltip()

  // Initialize popovers
  $('[data-bs-toggle="popover"]').popover()

  // Smooth scrolling for anchor links
  $('a[href^="#"]').on("click", function (event) {
    var target = $(this.getAttribute("href"))
    if (target.length) {
      event.preventDefault()
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: target.offset().top - 100,
          },
          1000,
        )
    }
  })

  // Form validation enhancement
  $("form").on("submit", function (e) {
    

    // Add was-validated class for Bootstrap validation
    this.classList.add("was-validated")

    // Check if form is valid
    if (!this.checkValidity()) {
      e.preventDefault()
      e.stopPropagation()

      // Focus on first invalid field
      const firstInvalid = $(this).find(":invalid").first()
      if (firstInvalid.length) {
        firstInvalid.focus()
      }
    }
  })

  // Auto-dismiss alerts after 5 seconds
  $(".alert:not(.alert-permanent)").each(function () {
    
    setTimeout(() => {
      $(this).fadeOut("slow")
    }, 5000)
  })

  // Loading state for buttons
  $('.btn[type="submit"]').on("click", function () {
    const $btn = $(this)
    const originalText = $btn.html()

    // Add loading state
    $btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Processing...')
    $btn.prop("disabled", true)

    // Reset after 30 seconds (fallback)
    setTimeout(() => {
      $btn.html(originalText)
      $btn.prop("disabled", false)
    }, 30000)
  })

  // Number formatting
  $(".number-format").each(function () {
    const number = Number.parseInt($(this).text())
    $(this).text(number.toLocaleString())
  })

  // Copy to clipboard functionality
  $(".copy-btn").on("click", function () {
    const target = $(this).data("target")
    const text = $(target).text()

    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied to clipboard!", "success")
    })
  })

  // Image preview functionality
  $('input[type="file"]').on("change", function (e) {
    const file = e.target.files[0]
    const preview = $(this).data("preview")

    if (file && preview) {
      const reader = new FileReader()
      reader.onload = (e) => {
        $(preview).attr("src", e.target.result).show()
      }
      reader.readAsDataURL(file)
    }
  })

  // Auto-save form data to localStorage
  $("form[data-autosave]").each(function () {
    
    const formId = $(this).attr("id") || "autosave-form"

    // Load saved data
    const savedData = localStorage.getItem(formId)
    if (savedData) {
      const data = JSON.parse(savedData)
      Object.keys(data).forEach((key) => {
        const field = $(this).find(`[name="${key}"]`)
        if (field.length) {
          field.val(data[key])
        }
      })
    }

    // Save data on change
    $(this).on("change input", "input, select, textarea", () => {
      const formData = {}
      $(this)
        .serializeArray()
        .forEach((item) => {
          formData[item.name] = item.value
        })
      localStorage.setItem(formId, JSON.stringify(formData))
    })

    // Clear saved data on successful submit
    $(this).on("submit", () => {
      localStorage.removeItem(formId)
    })
  })

  // Keyboard shortcuts
  $(document).on("keydown", (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault()
      $("#searchInput").focus()
    }

    // Escape to close modals
    if (e.key === "Escape") {
      $(".modal.show").modal("hide")
    }
  })

  // Lazy loading for images
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove("lazy")
          imageObserver.unobserve(img)
        }
      })
    })

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img)
    })
  }

  // Progress bar animation
  $(".progress-bar").each(function () {
    const $bar = $(this)
    const width = $bar.attr("aria-valuenow")
    $bar.css("width", "0%")

    setTimeout(() => {
      $bar.animate(
        {
          width: width + "%",
        },
        1000,
      )
    }, 500)
  })

  // Chart.js default configuration
  if (typeof Chart !== "undefined") {
    Chart.defaults.font.family = "'Inter', sans-serif"
    Chart.defaults.color = "#6c757d"
    Chart.defaults.plugins.legend.labels.usePointStyle = true
    Chart.defaults.plugins.legend.labels.padding = 20
    Chart.defaults.elements.arc.borderWidth = 0
    Chart.defaults.elements.bar.borderRadius = 8
    Chart.defaults.elements.line.borderWidth = 3
    Chart.defaults.elements.point.radius = 6
    Chart.defaults.elements.point.hoverRadius = 8
  }

  // Initialize AOS (Animate On Scroll) if available
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    })
  }
})

// Utility Functions
function showToast(message, type = "info", duration = 3000) {
  const toastHtml = `
        <div class="toast align-items-center text-white bg-${type} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-${getToastIcon(type)} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `

  // Create toast container if it doesn't exist
  if (!$("#toastContainer").length) {
    $("body").append('<div id="toastContainer" class="toast-container position-fixed top-0 end-0 p-3"></div>')
  }

  const $toast = $(toastHtml)
  $("#toastContainer").append($toast)

  const toast = new bootstrap.Toast($toast[0], {
    delay: duration,
  })

  toast.show()

  // Remove toast element after it's hidden
  $toast.on("hidden.bs.toast", function () {
    $(this).remove()
  })
}

function getToastIcon(type) {
  const icons = {
    success: "check-circle",
    danger: "exclamation-triangle",
    warning: "exclamation-triangle",
    info: "info-circle",
    primary: "info-circle",
  }
  return icons[type] || "info-circle"
}

function formatNumber(num) {
  return new Intl.NumberFormat().format(num)
}

function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

function formatDate(date, options = {}) {
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return new Intl.DateTimeFormat("en-US", { ...defaultOptions, ...options }).format(new Date(date))
}

function debounce(func, wait, immediate) {
  let timeout
  return function executedFunction() {
    
    const args = arguments
    const later = () => {
      timeout = null
      if (!immediate) func.apply(this, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(this, args)
  }
}

function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Export functions for global use
window.AgroPulse = {
  showToast,
  formatNumber,
  formatCurrency,
  formatDate,
  debounce,
  throttle,
}

// Service Worker Registration (if available)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/static/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful")
      })
      .catch((err) => {
        console.log("ServiceWorker registration failed")
      })
  })
}

// Performance monitoring
window.addEventListener("load", () => {
  if ("performance" in window) {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
    console.log(`Page load time: ${loadTime}ms`)

    // Send to analytics if needed
    if (loadTime > 3000) {
      console.warn("Page load time is slow:", loadTime + "ms")
    }
  }
})

// Error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error)

  // Show user-friendly error message
  showToast("An error occurred. Please try again.", "danger")
})

// Unhandled promise rejection handling
window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason)

  // Show user-friendly error message
  showToast("An error occurred. Please try again.", "danger")

  // Prevent the default browser behavior
  e.preventDefault()
})

import $ from "jquery"
import "bootstrap"
import AOS from "aos"
