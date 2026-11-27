import bpy
import os

glb = "/Users/zhuchengbin/Downloads/个人网页/public/models/blend-7277.glb"
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb)

changed = 0
for mat in bpy.data.materials:
    name = (mat.name or "").lower()
    waterish = "water" in name or "水" in name
    if not mat.use_nodes or not mat.node_tree:
        continue
    for node in mat.node_tree.nodes:
        if node.type != "BSDF_PRINCIPLED":
            continue
        base = node.inputs.get("Base Color")
        rough = node.inputs.get("Roughness")
        spec = node.inputs.get("Specular IOR Level") or node.inputs.get("Specular")
        metal = node.inputs.get("Metallic")
        if waterish or (base and hasattr(base, "default_value") and base.default_value[2] > base.default_value[0] + 0.08):
            if base:
                c = list(base.default_value)
                c[0] *= 0.45
                c[1] *= 0.55
                c[2] *= 0.65
                base.default_value = c
                changed += 1
            if rough:
                rough.default_value = max(0.35, min(0.85, rough.default_value + 0.25))
            if spec and hasattr(spec, "default_value"):
                spec.default_value = min(0.25, float(spec.default_value) * 0.4)
            if metal and hasattr(metal, "default_value"):
                metal.default_value = 0.0
            changed += 1

for img in bpy.data.images:
    n = img.name.lower()
    if "water" not in n and "so4water" not in n:
        continue
    try:
        pixels = list(img.pixels)
    except Exception:
        continue
    for i in range(0, len(pixels) - 3, 4):
        pixels[i] *= 0.42
        pixels[i + 1] *= 0.5
        pixels[i + 2] *= 0.58
    img.pixels = pixels
    img.update()
    changed += 1

print("WATER_CHANGED", changed)
bpy.ops.export_scene.gltf(
    filepath=glb,
    export_format="GLB",
    export_image_format="JPEG",
    export_jpeg_quality=74,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=7,
    export_cameras=False,
    export_lights=False,
    export_apply=True,
)
print("GLB_OK", os.path.getsize(glb))
