import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [topic, setTopic] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('30 min');
  const [goal, setGoal] = useState('Build a small project');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [startedDay, setStartedDay] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStartedDay(null);

    try {
      const response = await fetch(`${API_URL}/generate-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          time_available: timeAvailable,
          goal,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan. Please try again.');
      }

      const data = await response.json();
      setPlan(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPlan(null);
    setTopic('');
    setTimeAvailable('30 min');
    setGoal('Build a small project');
    setError(null);
    setStartedDay(null);
  };

  const handleStartDay = (dayNum) => {
    setStartedDay(dayNum);
    setTimeout(() => {
      alert(`Day ${dayNum} started! Keep up the momentum!`);
    }, 300);
  };

  // Gradient backgrounds for each day
  const dayGradients = [
    'from-rose-400 to-orange-400',
    'from-orange-400 to-amber-400',
    'from-amber-400 to-yellow-400',
    'from-emerald-400 to-teal-400',
    'from-teal-400 to-cyan-400',
    'from-cyan-400 to-blue-400',
    'from-blue-400 to-violet-400',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-accent-50/30">
      {/* Animated Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-accent-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-warm-200/40 rounded-full blur-2xl animate-pulse-slow" />
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-md border-b border-primary-100">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Momentum
              </h1>
              <p className="text-sm text-slate-500 font-medium">Turn curiosity into action</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 py-12">
        {!plan ? (
          /* Input Form */
          <div className="max-w-xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-primary-500/10 border border-primary-100 p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-4">
                  <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                  AI-Powered Learning Plans
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                  What sparks your curiosity?
                </h2>
                <p className="text-slate-500">
                  Transform any topic into a personalized 7-day action plan
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Topic Input */}
                <div>
                  <label
                    htmlFor="topic"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Topic of curiosity
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., AI agents, Python, Photography, Guitar..."
                      className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all placeholder:text-slate-400 text-slate-700 bg-slate-50/50"
                      required
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
                      💡
                    </div>
                  </div>
                </div>

                {/* Time Available */}
                <div>
                  <label
                    htmlFor="time"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Time available per day
                  </label>
                  <div className="relative">
                    <select
                      id="time"
                      value={timeAvailable}
                      onChange={(e) => setTimeAvailable(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all bg-white text-slate-700 appearance-none cursor-pointer"
                    >
                      <option value="15 min">⏱️ 15 minutes</option>
                      <option value="30 min">⏱️ 30 minutes</option>
                      <option value="1 hour">⏱️ 1 hour</option>
                      <option value="2 hours">⏱️ 2 hours</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Goal */}
                <div>
                  <label
                    htmlFor="goal"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Your goal
                  </label>
                  <div className="relative">
                    <select
                      id="goal"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all bg-white text-slate-700 appearance-none cursor-pointer"
                    >
                      <option value="Learn basics">📚 Learn basics</option>
                      <option value="Build a small project">🚀 Build a small project</option>
                      <option value="Explore career path">💼 Explore career path</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 text-sm flex items-start gap-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !topic.trim()}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold text-lg hover:from-primary-700 hover:to-accent-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating your plan...
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      Generate Action Plan
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { icon: '🎯', text: 'Personalized', subtext: 'Tailored to you' },
                { icon: '⚡', text: 'Quick', subtext: '7-day sprints' },
                { icon: '🏆', text: 'Achievable', subtext: 'Bite-sized tasks' },
              ].map((feature, i) => (
                <div key={i} className="text-center p-4 rounded-2xl bg-white/60 backdrop-blur-sm">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <div className="font-semibold text-slate-700">{feature.text}</div>
                  <div className="text-xs text-slate-500">{feature.subtext}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Action Plan Display */
          <div className="max-w-4xl mx-auto">
            {/* Plan Header */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-primary-500/10 border border-primary-100 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 text-white px-8 py-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-accent-500/20 animate-gradient" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      7 Day Action Sprint
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">{plan.title}</h2>
                  <p className="text-primary-100 text-lg">{plan.description}</p>

                  <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-white/20">
                    <div className="flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-full">
                      <span>⏱️</span>
                      <span>{timeAvailable} per day</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-full">
                      <span>🎯</span>
                      <span>{goal}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Days List */}
            <div className="space-y-4">
              {plan.days.map((day, index) => (
                <div
                  key={day.day}
                  className={`group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-primary-500/10 transition-all hover:-translate-y-1 ${startedDay === day.day ? 'ring-2 ring-success-500' : ''}`}
                >
                  <div className="flex items-stretch">
                    {/* Day Number with Gradient */}
                    <div className={`w-20 md:w-24 flex-shrink-0 bg-gradient-to-br ${dayGradients[index]} flex flex-col items-center justify-center text-white p-4`}>
                      <span className="text-xs font-bold uppercase tracking-wider opacity-80">Day</span>
                      <span className="text-4xl md:text-5xl font-bold">{day.day}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 md:p-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors">
                        {day.objective}
                      </h3>
                      <p className="text-slate-600 mb-4 leading-relaxed">{day.task}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success-100 text-success-700 font-medium">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {day.expected_result}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0 p-4 md:p-6 flex items-center">
                      <button
                        onClick={() => handleStartDay(day.day)}
                        disabled={startedDay !== null && startedDay !== day.day}
                        className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                          startedDay === day.day
                            ? 'bg-success-500 text-white'
                            : startedDay !== null
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-primary-50 text-primary-700 hover:bg-primary-100 hover:scale-105'
                        }`}
                      >
                        {startedDay === day.day ? (
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Started
                          </span>
                        ) : (
                          'Start'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-10 p-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-accent-600/20" />
              <div className="relative">
                <h3 className="text-2xl font-bold mb-3">Ready to begin your journey?</h3>
                <p className="text-primary-100 mb-6">Click "Start" on Day 1 to commit to your learning sprint!</p>
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-white text-primary-600 font-bold rounded-xl hover:bg-primary-50 transition-all hover:scale-105 shadow-lg"
                >
                  Create Another Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative max-w-5xl mx-auto px-4 py-8 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
          <span>Momentum — Turn curiosity into action</span>
        </div>
      </footer>
    </div>
  );
}

export default App;