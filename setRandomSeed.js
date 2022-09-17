const initialSeedElement = document.querySelector('#initial-seed')
const randomSeedElement = document.querySelector('#timestamp-initial-seed')

randomSeedElement.addEventListener('click', () => {
  // Disable initial seed entry when random is checked
  if (randomSeedElement.checked) {
    initialSeedElement.disabled = true
    // Set initial seed based on current time
    initialSeedElement.value = Number(new Date())
  } else {
    initialSeedElement.disabled = false
  }
})