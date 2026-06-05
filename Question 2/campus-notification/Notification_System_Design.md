# Stage 1

## Approach

The Campus Notifications Microservice fetches all notifications from the protected evaluation API using a Bearer token. It then computes a Priority Inbox showing the top 10 unread notifications based on type weight and recency.

## How Priority is Calculated

Each notification is assigned a numeric weight based on its type:

| Type      | Weight |
|-----------|--------|
| Placement | 3      |
| Result    | 2      |
| Event     | 1      |

Notifications are sorted using two keys:
1. **Weight descending** — higher importance types always rank above lower ones
2. **Timestamp descending** — among same-type notifications, newer ones rank higher

```js
notifications
  .map(n => ({ ...n, weight: TYPE_WEIGHT[n.Type], ts: new Date(n.Timestamp).getTime() }))
  .sort((a, b) => b.weight - a.weight || b.ts - a.ts)
  .slice(0, 10)
```

## How Top 10 is Maintained Efficiently When New Notifications Arrive

For a static batch, sorting and slicing (O(n log n)) is sufficient.

For a continuous stream of incoming notifications, a **min-heap of size 10** is the efficient approach:

- Maintain a min-heap of size 10 keyed by `(weight, timestamp)`.
- For each new notification:
  - If heap size < 10 → push directly.
  - Else if new notification's priority > heap minimum → pop the min, push the new one.
  - Else → discard the new notification.
- This gives **O(log 10) = O(1)** per insertion instead of re-sorting the entire list.

This ensures the top 10 priority notifications are always available in constant time regardless of how many total notifications exist.
