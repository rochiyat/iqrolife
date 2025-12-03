-- Add registrations menu item
INSERT INTO menu (name, label, icon, href, parent_id, order_index, roles, is_active) 
VALUES (
  'registrations', 
  'Registrations', 
  'ClipboardList', 
  '/dashboard/registrations', 
  NULL, 
  4, 
  '["superadmin", "staff", "teacher"]'::jsonb,
  true
)
ON CONFLICT (name) DO UPDATE SET
  label = EXCLUDED.label,
  icon = EXCLUDED.icon,
  href = EXCLUDED.href,
  order_index = EXCLUDED.order_index,
  roles = EXCLUDED.roles,
  is_active = EXCLUDED.is_active;
